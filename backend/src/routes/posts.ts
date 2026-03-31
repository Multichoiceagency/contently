import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import dayjs from "dayjs";
import { prisma } from "../lib/prisma.js";
import { publishQueue } from "../lib/queue.js";

const platformEnum = z.enum(["linkedin", "facebook", "twitter", "instagram"]);
const statusEnum = z.enum([
  "draft",
  "scheduled",
  "publishing",
  "published",
  "failed",
]);

const createPostSchema = z.object({
  content: z.string().min(1, "Content is required").max(5000),
  mediaUrls: z.array(z.string().url()).default([]),
  platform: platformEnum,
  status: z.enum(["draft", "scheduled"]).default("draft"),
  scheduledAt: z.string().datetime().optional(),
});

const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  platform: platformEnum.optional(),
  status: z.enum(["draft", "scheduled"]).optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
});

const schedulePostSchema = z.object({
  scheduledAt: z.string().datetime("Must be a valid ISO 8601 datetime"),
});

const listPostsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: statusEnum.optional(),
  platform: platformEnum.optional(),
});

const calendarQuery = z.object({
  from: z.string().datetime("from must be ISO 8601"),
  to: z.string().datetime("to must be ISO 8601"),
  platform: platformEnum.optional(),
});

export default async function postRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", fastify.requireWorkspace);

  // GET /posts
  fastify.get(
    "/posts",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = listPostsQuery.safeParse(request.query);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { page, limit, status, platform } = parseResult.data;
      const skip = (page - 1) * limit;

      const where = {
        workspaceId: request.workspaceId,
        ...(status ? { status } : {}),
        ...(platform ? { platform } : {}),
      };

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: {
            _count: {
              select: { analytics: true },
            },
          },
        }),
        prisma.post.count({ where }),
      ]);

      return reply.send({
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  );

  // POST /posts
  fastify.post(
    "/posts",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = createPostSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { content, mediaUrls, platform, status, scheduledAt } =
        parseResult.data;

      if (status === "scheduled" && !scheduledAt) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message:
            "scheduledAt is required when status is 'scheduled'",
        });
      }

      if (scheduledAt && dayjs(scheduledAt).isBefore(dayjs())) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: "scheduledAt must be in the future",
        });
      }

      const post = await prisma.post.create({
        data: {
          content,
          mediaUrls,
          platform,
          status,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          workspaceId: request.workspaceId,
        },
      });

      // If scheduled, add to publish queue
      if (status === "scheduled" && scheduledAt) {
        const delay = dayjs(scheduledAt).diff(dayjs(), "millisecond");
        await publishQueue.add(
          "publish-post",
          { postId: post.id, workspaceId: request.workspaceId },
          { delay: Math.max(delay, 0), jobId: `publish-${post.id}` }
        );
      }

      return reply.status(201).send({ post });
    }
  );

  // GET /posts/calendar
  fastify.get(
    "/posts/calendar",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = calendarQuery.safeParse(request.query);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { from, to, platform } = parseResult.data;

      const posts = await prisma.post.findMany({
        where: {
          workspaceId: request.workspaceId,
          ...(platform ? { platform } : {}),
          OR: [
            {
              scheduledAt: {
                gte: new Date(from),
                lte: new Date(to),
              },
            },
            {
              publishedAt: {
                gte: new Date(from),
                lte: new Date(to),
              },
            },
          ],
        },
        orderBy: { scheduledAt: "asc" },
        select: {
          id: true,
          content: true,
          platform: true,
          status: true,
          scheduledAt: true,
          publishedAt: true,
          mediaUrls: true,
        },
      });

      return reply.send({ posts });
    }
  );

  // GET /posts/:id
  fastify.get(
    "/posts/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const post = await prisma.post.findFirst({
        where: { id, workspaceId: request.workspaceId },
        include: {
          analytics: {
            orderBy: { fetchedAt: "desc" },
            take: 1,
          },
        },
      });

      if (!post) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Post not found",
        });
      }

      return reply.send({ post });
    }
  );

  // PUT /posts/:id
  fastify.put(
    "/posts/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const existingPost = await prisma.post.findFirst({
        where: { id, workspaceId: request.workspaceId },
      });

      if (!existingPost) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Post not found",
        });
      }

      if (
        existingPost.status === "published" ||
        existingPost.status === "publishing"
      ) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Cannot update a post that is published or publishing",
        });
      }

      const parseResult = updatePostSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const data = parseResult.data;

      if (
        data.scheduledAt !== undefined &&
        data.scheduledAt !== null &&
        dayjs(data.scheduledAt).isBefore(dayjs())
      ) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: "scheduledAt must be in the future",
        });
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...data,
          scheduledAt:
            data.scheduledAt === null
              ? null
              : data.scheduledAt
                ? new Date(data.scheduledAt)
                : undefined,
        },
      });

      // If rescheduled, update the queue job
      if (data.status === "scheduled" || data.scheduledAt) {
        const targetTime = data.scheduledAt
          ? data.scheduledAt
          : post.scheduledAt?.toISOString();

        if (targetTime) {
          // Remove old job if exists
          const existingJob = await publishQueue.getJob(`publish-${id}`);
          if (existingJob) {
            await existingJob.remove();
          }

          const delay = dayjs(targetTime).diff(dayjs(), "millisecond");
          await publishQueue.add(
            "publish-post",
            { postId: post.id, workspaceId: request.workspaceId },
            { delay: Math.max(delay, 0), jobId: `publish-${post.id}` }
          );
        }
      }

      return reply.send({ post });
    }
  );

  // DELETE /posts/:id
  fastify.delete(
    "/posts/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const post = await prisma.post.findFirst({
        where: { id, workspaceId: request.workspaceId },
      });

      if (!post) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Post not found",
        });
      }

      // Remove scheduled job if exists
      const existingJob = await publishQueue.getJob(`publish-${id}`);
      if (existingJob) {
        await existingJob.remove();
      }

      await prisma.post.delete({ where: { id } });

      return reply.status(204).send();
    }
  );

  // POST /posts/:id/schedule
  fastify.post(
    "/posts/:id/schedule",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const post = await prisma.post.findFirst({
        where: { id, workspaceId: request.workspaceId },
      });

      if (!post) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Post not found",
        });
      }

      if (post.status !== "draft" && post.status !== "failed") {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Only draft or failed posts can be scheduled",
        });
      }

      const parseResult = schedulePostSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { scheduledAt } = parseResult.data;

      if (dayjs(scheduledAt).isBefore(dayjs())) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: "scheduledAt must be in the future",
        });
      }

      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          status: "scheduled",
          scheduledAt: new Date(scheduledAt),
          error: null,
        },
      });

      const delay = dayjs(scheduledAt).diff(dayjs(), "millisecond");
      await publishQueue.add(
        "publish-post",
        { postId: id, workspaceId: request.workspaceId },
        { delay: Math.max(delay, 0), jobId: `publish-${id}` }
      );

      return reply.send({ post: updatedPost });
    }
  );
}
