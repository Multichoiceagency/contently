import fp from "fastify-plugin";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js";

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const decoded = await request.jwtVerify<{
          userId: string;
          email: string;
        }>();
        request.userId = decoded.userId;
      } catch (err) {
        reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid or expired access token",
        });
      }
    }
  );

  fastify.decorate(
    "requireWorkspace",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const workspaceId = request.headers["x-workspace-id"] as
        | string
        | undefined;

      if (!workspaceId) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "x-workspace-id header is required",
        });
      }

      const member = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: request.userId,
            workspaceId,
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

      request.workspaceId = workspaceId;
      request.memberRole = member.role;
    }
  );
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    requireWorkspace: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

export default fp(authPlugin, {
  name: "auth-plugin",
});
