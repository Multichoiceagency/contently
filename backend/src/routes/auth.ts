import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

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

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
        },
      });

      const workspaceName = `${name}'s Workspace`;
      const workspace = await prisma.workspace.create({
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

      const tokens = await generateTokens(fastify, user.id, user.email);

      return reply.status(201).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
        },
        ...tokens,
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

      if (!user) {
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
