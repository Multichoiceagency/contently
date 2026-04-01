import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../lib/prisma.js";
import {
  generateVerificationCode,
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email.service.js";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(100),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

const resendSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Reset code must be 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const VERIFICATION_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    crypto.randomBytes(3).toString("hex")
  );
}

async function generateTokens(
  fastify: FastifyInstance,
  userId: string,
  email: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = fastify.jwt.sign(
    { userId, email },
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshTokenValue = crypto.randomBytes(48).toString("hex");

  await prisma.refreshToken.create({
    data: {
      token: refreshTokenValue,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  });

  return { accessToken, refreshToken: refreshTokenValue };
}

export default async function authRoutes(fastify: FastifyInstance) {
  // POST /auth/register
  fastify.post(
    "/auth/register",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = registerSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { email, password, name } = parseResult.data;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.status(409).send({
          statusCode: 409,
          error: "Conflict",
          message: "A user with this email already exists",
        });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const code = generateVerificationCode();

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          emailVerified: false,
          verificationCode: code,
          verificationExpiry: new Date(Date.now() + VERIFICATION_EXPIRY_MS),
        },
      });

      const workspaceName = `${name}'s Workspace`;
      await prisma.workspace.create({
        data: {
          name: workspaceName,
          slug: generateSlug(workspaceName),
          members: {
            create: {
              userId: user.id,
              role: "owner",
            },
          },
        },
      });

      try {
        await sendVerificationEmail(email, name, code);
      } catch (err) {
        fastify.log.error(err, "Failed to send verification email");
      }

      return reply.status(201).send({
        message: "Account created. Check your email for the verification code.",
        email: user.email,
        requiresVerification: true,
      });
    }
  );

  // POST /auth/login
  fastify.post(
    "/auth/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = loginSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { email, password } = parseResult.data;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          workspaceMembers: {
            include: {
              workspace: {
                select: { id: true, name: true, slug: true, plan: true },
              },
            },
          },
        },
      });

      if (!user || !user.passwordHash) {
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid email or password",
        });
      }

      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid email or password",
        });
      }

      if (!user.emailVerified) {
        // Resend verification code
        const code = generateVerificationCode();
        await prisma.user.update({
          where: { id: user.id },
          data: {
            verificationCode: code,
            verificationExpiry: new Date(Date.now() + VERIFICATION_EXPIRY_MS),
          },
        });

        try {
          await sendVerificationEmail(user.email, user.name, code);
        } catch (err) {
          fastify.log.error(err, "Failed to send verification email");
        }

        return reply.status(403).send({
          statusCode: 403,
          error: "Email Not Verified",
          message: "Please verify your email. A new code has been sent.",
          requiresVerification: true,
          email: user.email,
        });
      }

      const tokens = await generateTokens(fastify, user.id, user.email);

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        workspaces: user.workspaceMembers.map((m) => ({
          ...m.workspace,
          role: m.role,
        })),
        ...tokens,
      });
    }
  );

  // POST /auth/refresh
  fastify.post(
    "/auth/refresh",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = refreshSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { refreshToken } = parseResult.data;

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken) {
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid refresh token",
        });
      }

      if (storedToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Refresh token has expired",
        });
      }

      // Delete the old refresh token (rotation)
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      const tokens = await generateTokens(
        fastify,
        storedToken.user.id,
        storedToken.user.email
      );

      return reply.send(tokens);
    }
  );

  // POST /auth/logout
  fastify.post(
    "/auth/logout",
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as { refreshToken?: string } | undefined;
      const refreshToken = body?.refreshToken;

      if (refreshToken) {
        await prisma.refreshToken.deleteMany({
          where: {
            token: refreshToken,
            userId: request.userId,
          },
        });
      } else {
        // If no specific token provided, invalidate all refresh tokens
        await prisma.refreshToken.deleteMany({
          where: { userId: request.userId },
        });
      }

      return reply.send({ message: "Logged out successfully" });
    }
  );

  // POST /auth/verify
  fastify.post(
    "/auth/verify",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = verifySchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues.map((i) => i.message).join(", "),
        });
      }

      const { email, code } = parseResult.data;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          workspaceMembers: {
            include: {
              workspace: {
                select: { id: true, name: true, slug: true, plan: true },
              },
            },
          },
        },
      });

      if (!user) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "User not found",
        });
      }

      if (user.emailVerified) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Already Verified",
          message: "Email is already verified",
        });
      }

      if (
        user.verificationCode !== code ||
        !user.verificationExpiry ||
        user.verificationExpiry < new Date()
      ) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Invalid Code",
          message: "Invalid or expired verification code",
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationCode: null,
          verificationExpiry: null,
        },
      });

      const tokens = await generateTokens(fastify, user.id, user.email);

      return reply.send({
        message: "Email verified successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        workspaces: user.workspaceMembers.map((m) => ({
          ...m.workspace,
          role: m.role,
        })),
        ...tokens,
      });
    }
  );

  // POST /auth/resend-code
  fastify.post(
    "/auth/resend-code",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = resendSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues.map((i) => i.message).join(", "),
        });
      }

      const { email } = parseResult.data;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Don't reveal whether user exists
        return reply.send({ message: "If that email exists, a new code has been sent." });
      }

      if (user.emailVerified) {
        return reply.send({ message: "Email is already verified." });
      }

      const code = generateVerificationCode();
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationCode: code,
          verificationExpiry: new Date(Date.now() + VERIFICATION_EXPIRY_MS),
        },
      });

      try {
        await sendVerificationEmail(user.email, user.name, code);
      } catch (err) {
        fastify.log.error(err, "Failed to send verification email");
      }

      return reply.send({ message: "If that email exists, a new code has been sent." });
    }
  );

  // POST /auth/forgot-password
  fastify.post(
    "/auth/forgot-password",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = forgotPasswordSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues.map((i) => i.message).join(", "),
        });
      }

      const { email } = parseResult.data;
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        const code = generateVerificationCode();
        await prisma.user.update({
          where: { id: user.id },
          data: {
            verificationCode: code,
            verificationExpiry: new Date(Date.now() + VERIFICATION_EXPIRY_MS),
          },
        });

        try {
          await sendPasswordResetEmail(user.email, user.name, code);
        } catch (err) {
          fastify.log.error(err, "Failed to send password reset email");
        }
      }

      // Always return success to prevent email enumeration
      return reply.send({ message: "If that email exists, a reset code has been sent." });
    }
  );

  // POST /auth/reset-password
  fastify.post(
    "/auth/reset-password",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = resetPasswordSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues.map((i) => i.message).join(", "),
        });
      }

      const { email, code, password } = parseResult.data;

      const user = await prisma.user.findUnique({ where: { email } });
      if (
        !user ||
        user.verificationCode !== code ||
        !user.verificationExpiry ||
        user.verificationExpiry < new Date()
      ) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Invalid Code",
          message: "Invalid or expired reset code",
        });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          verificationCode: null,
          verificationExpiry: null,
          emailVerified: true,
        },
      });

      // Invalidate all existing refresh tokens
      await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

      return reply.send({ message: "Password reset successfully. Please log in." });
    }
  );

  // POST /auth/google
  const googleSchema = z.object({
    credential: z.string().min(1, "Google credential is required"),
  });

  fastify.post(
    "/auth/google",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = googleSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues.map((i) => i.message).join(", "),
        });
      }

      const { credential } = parseResult.data;

      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        return reply.status(500).send({
          statusCode: 500,
          error: "Configuration Error",
          message: "Google OAuth is not configured",
        });
      }

      const client = new OAuth2Client(googleClientId);

      let payload;
      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: googleClientId,
        });
        payload = ticket.getPayload();
      } catch {
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid Google credential",
        });
      }

      if (!payload || !payload.email || !payload.sub) {
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Unable to extract user info from Google",
        });
      }

      const { sub: googleId, email, name, picture } = payload;

      // Check if user exists by googleId
      let user = await prisma.user.findUnique({
        where: { googleId },
        include: {
          workspaceMembers: {
            include: {
              workspace: {
                select: { id: true, name: true, slug: true, plan: true },
              },
            },
          },
        },
      });

      if (!user) {
        // Check if user exists by email (link accounts)
        const existingByEmail = await prisma.user.findUnique({
          where: { email },
          include: {
            workspaceMembers: {
              include: {
                workspace: {
                  select: { id: true, name: true, slug: true, plan: true },
                },
              },
            },
          },
        });

        if (existingByEmail) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { id: existingByEmail.id },
            data: {
              googleId,
              emailVerified: true,
              avatar: existingByEmail.avatar || picture || null,
            },
            include: {
              workspaceMembers: {
                include: {
                  workspace: {
                    select: { id: true, name: true, slug: true, plan: true },
                  },
                },
              },
            },
          });
        } else {
          // Create new user
          const userName = name || email.split("@")[0];
          user = await prisma.user.create({
            data: {
              email,
              googleId,
              name: userName,
              avatar: picture || null,
              emailVerified: true,
              passwordHash: null,
            },
            include: {
              workspaceMembers: {
                include: {
                  workspace: {
                    select: { id: true, name: true, slug: true, plan: true },
                  },
                },
              },
            },
          });

          // Create default workspace
          const workspaceName = `${userName}'s Workspace`;
          await prisma.workspace.create({
            data: {
              name: workspaceName,
              slug: generateSlug(workspaceName),
              members: {
                create: {
                  userId: user.id,
                  role: "owner",
                },
              },
            },
          });

          // Re-fetch with workspace
          user = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              workspaceMembers: {
                include: {
                  workspace: {
                    select: { id: true, name: true, slug: true, plan: true },
                  },
                },
              },
            },
          }) as typeof user;
        }
      }

      if (!user) {
        return reply.status(500).send({
          statusCode: 500,
          error: "Server Error",
          message: "Failed to create or find user",
        });
      }

      const tokens = await generateTokens(fastify, user.id, user.email);

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        workspaces: user.workspaceMembers.map((m) => ({
          ...m.workspace,
          role: m.role,
        })),
        ...tokens,
      });
    }
  );

  // GET /auth/me
  fastify.get(
    "/auth/me",
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = await prisma.user.findUnique({
        where: { id: request.userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          createdAt: true,
          workspaceMembers: {
            include: {
              workspace: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  plan: true,
                  logo: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "User not found",
        });
      }

      return reply.send({
        ...user,
        workspaces: user.workspaceMembers.map((m) => ({
          ...m.workspace,
          role: m.role,
        })),
        workspaceMembers: undefined,
      });
    }
  );
}
