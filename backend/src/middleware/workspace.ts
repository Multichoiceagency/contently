import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function requireWorkspaceMembership(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const workspaceId = request.headers["x-workspace-id"] as string | undefined;

  if (!workspaceId) {
    reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "x-workspace-id header is required",
    });
    return;
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
    reply.status(403).send({
      statusCode: 403,
      error: "Forbidden",
      message: "You are not a member of this workspace",
    });
    return;
  }

  request.workspaceId = workspaceId;
  request.memberRole = member.role;
}

export async function requireRole(
  roles: string[],
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!roles.includes(request.memberRole)) {
    reply.status(403).send({
      statusCode: 403,
      error: "Forbidden",
      message: `This action requires one of the following roles: ${roles.join(", ")}`,
    });
  }
}
