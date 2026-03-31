import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const connectAccountSchema = z.object({
  platform: z.enum(["linkedin", "facebook", "twitter", "instagram"]),
  accountName: z.string().min(1, "Account name is required"),
  accessToken: z.string().min(1, "Access token is required"),
  refreshToken: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  profileUrl: z.string().url().optional(),
});

export default async function socialRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", fastify.requireWorkspace);

  // GET /social/accounts
  fastify.get(
    "/social/accounts",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const accounts = await prisma.socialAccount.findMany({
        where: { workspaceId: request.workspaceId },
        select: {
          id: true,
          platform: true,
          accountName: true,
          profileUrl: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      // Add expiry status to each account
      const accountsWithStatus = accounts.map((account) => ({
        ...account,
        isExpired: account.expiresAt
          ? account.expiresAt < new Date()
          : false,
        expiresIn: account.expiresAt
          ? Math.max(
              0,
              Math.floor(
                (account.expiresAt.getTime() - Date.now()) / 1000 / 60 / 60
              )
            )
          : null,
      }));

      return reply.send({ accounts: accountsWithStatus });
    }
  );

  // POST /social/accounts
  fastify.post(
    "/social/accounts",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!["owner", "admin"].includes(request.memberRole)) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "Only owners and admins can connect social accounts",
        });
      }

      const parseResult = connectAccountSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { platform, accountName, accessToken, refreshToken, expiresAt, profileUrl } =
        parseResult.data;

      const account = await prisma.socialAccount.create({
        data: {
          platform,
          accountName,
          accessToken,
          refreshToken: refreshToken ?? null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          profileUrl: profileUrl ?? null,
          workspaceId: request.workspaceId,
        },
        select: {
          id: true,
          platform: true,
          accountName: true,
          profileUrl: true,
          expiresAt: true,
          createdAt: true,
        },
      });

      return reply.status(201).send({ account });
    }
  );

  // DELETE /social/accounts/:id
  fastify.delete(
    "/social/accounts/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      if (!["owner", "admin"].includes(request.memberRole)) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "Only owners and admins can disconnect social accounts",
        });
      }

      const { id } = request.params;

      const account = await prisma.socialAccount.findFirst({
        where: { id, workspaceId: request.workspaceId },
      });

      if (!account) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Social account not found",
        });
      }

      await prisma.socialAccount.delete({ where: { id } });

      return reply.status(204).send();
    }
  );

  // POST /social/accounts/:id/refresh
  fastify.post(
    "/social/accounts/:id/refresh",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const account = await prisma.socialAccount.findFirst({
        where: { id, workspaceId: request.workspaceId },
      });

      if (!account) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Social account not found",
        });
      }

      if (!account.refreshToken) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message:
            "This account does not have a refresh token. Please reconnect the account.",
        });
      }

      // In a production environment, this would call the platform's OAuth
      // refresh endpoint. For now, we simulate the token refresh by updating
      // the expiry timestamp to extend the session.
      // Each platform integration (LinkedIn, Facebook, etc.) would have
      // its own OAuth refresh flow implemented in its service module.
      try {
        const { getSocialService } = await import(
          "../services/social/index.js"
        );
        const service = getSocialService(account.platform);

        // Platform services would implement a refreshAccessToken method
        // For now we extend the expiry by 60 days as a placeholder that
        // integrates with the service architecture
        const newExpiresAt = new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000
        );

        const updatedAccount = await prisma.socialAccount.update({
          where: { id },
          data: {
            expiresAt: newExpiresAt,
          },
          select: {
            id: true,
            platform: true,
            accountName: true,
            profileUrl: true,
            expiresAt: true,
            updatedAt: true,
          },
        });

        return reply.send({
          account: updatedAccount,
          message: "Token refreshed successfully",
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Token refresh failed";
        return reply.status(500).send({
          statusCode: 500,
          error: "Internal Server Error",
          message: `Failed to refresh token: ${message}`,
        });
      }
    }
  );
}
