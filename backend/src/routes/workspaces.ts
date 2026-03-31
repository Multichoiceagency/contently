import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  logo: z.string().url().optional(),
});

const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  logo: z.string().url().nullable().optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member"]).default("member"),
});

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

export default async function workspaceRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("preHandler", fastify.authenticate);

  // GET /workspaces
  fastify.get(
    "/workspaces",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const memberships = await prisma.workspaceMember.findMany({
        where: { userId: request.userId },
        include: {
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              plan: true,
              createdAt: true,
              _count: {
                select: {
                  members: true,
                  posts: true,
                  socialAccounts: true,
                },
              },
            },
          },
        },
      });

      return reply.send({
        workspaces: memberships.map((m) => ({
          ...m.workspace,
          role: m.role,
          joinedAt: m.joinedAt,
        })),
      });
    }
  );

  // POST /workspaces
  fastify.post(
    "/workspaces",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = createWorkspaceSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { name, logo } = parseResult.data;

      const workspace = await prisma.workspace.create({
        data: {
          name,
          slug: generateSlug(name),
          logo: logo ?? null,
          members: {
            create: {
              userId: request.userId,
              role: "owner",
            },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true },
              },
            },
          },
        },
      });

      return reply.status(201).send({ workspace });
    }
  );

  // GET /workspaces/:id
  fastify.get(
    "/workspaces/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const member = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: request.userId,
            workspaceId: id,
          },
        },
      });

      if (!member) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You are not a member of this workspace",
        });
      }

      const workspace = await prisma.workspace.findUnique({
        where: { id },
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true },
              },
            },
          },
          subscription: true,
          _count: {
            select: {
              posts: true,
              socialAccounts: true,
              aiGenerations: true,
            },
          },
        },
      });

      if (!workspace) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Workspace not found",
        });
      }

      return reply.send({ workspace, role: member.role });
    }
  );

  // PUT /workspaces/:id
  fastify.put(
    "/workspaces/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const member = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: request.userId,
            workspaceId: id,
          },
        },
      });

      if (!member || !["owner", "admin"].includes(member.role)) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "Only owners and admins can update workspace settings",
        });
      }

      const parseResult = updateWorkspaceSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const workspace = await prisma.workspace.update({
        where: { id },
        data: parseResult.data,
      });

      return reply.send({ workspace });
    }
  );

  // POST /workspaces/:id/invite
  fastify.post(
    "/workspaces/:id/invite",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const member = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: request.userId,
            workspaceId: id,
          },
        },
      });

      if (!member || !["owner", "admin"].includes(member.role)) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "Only owners and admins can invite members",
        });
      }

      const parseResult = inviteMemberSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { email, role } = parseResult.data;

      const invitedUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!invitedUser) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "No user found with this email address",
        });
      }

      const existingMember = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: invitedUser.id,
            workspaceId: id,
          },
        },
      });

      if (existingMember) {
        return reply.status(409).send({
          statusCode: 409,
          error: "Conflict",
          message: "This user is already a member of this workspace",
        });
      }

      const newMember = await prisma.workspaceMember.create({
        data: {
          userId: invitedUser.id,
          workspaceId: id,
          role,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      });

      return reply.status(201).send({ member: newMember });
    }
  );

  // GET /workspaces/:id/members
  fastify.get(
    "/workspaces/:id/members",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const member = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: request.userId,
            workspaceId: id,
          },
        },
      });

      if (!member) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You are not a member of this workspace",
        });
      }

      const members = await prisma.workspaceMember.findMany({
        where: { workspaceId: id },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
        orderBy: { joinedAt: "asc" },
      });

      return reply.send({ members });
    }
  );
}
