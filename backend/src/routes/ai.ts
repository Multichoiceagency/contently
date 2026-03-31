import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  generateCaption,
  generateHashtags,
  generateIdeas,
  optimizeContent,
} from "../services/ai.service.js";

const generateSchema = z.object({
  type: z.enum(["caption", "hashtags", "ideas"]),
  topic: z.string().min(1, "Topic is required").optional(),
  platform: z
    .enum(["linkedin", "facebook", "twitter", "instagram"])
    .optional(),
  tone: z.string().optional(),
  niche: z.string().optional(),
  count: z.number().int().min(1).max(20).optional(),
});

const optimizeSchema = z.object({
  content: z.string().min(1, "Content is required"),
  analyticsContext: z
    .object({
      impressions: z.number().int().min(0),
      clicks: z.number().int().min(0),
      engagement: z.number().min(0).max(1),
    })
    .optional(),
});

const historyQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.enum(["caption", "hashtags", "ideas", "optimization"]).optional(),
});

export default async function aiRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", fastify.requireWorkspace);

  // POST /ai/generate
  fastify.post(
    "/ai/generate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = generateSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { type, topic, platform, tone, niche, count } = parseResult.data;

      let aiResult: { result: string; tokensUsed: number };

      try {
        switch (type) {
          case "caption": {
            if (!topic || !platform) {
              return reply.status(400).send({
                statusCode: 400,
                error: "Validation Error",
                message:
                  "topic and platform are required for caption generation",
              });
            }
            aiResult = await generateCaption({ topic, platform, tone });
            break;
          }
          case "hashtags": {
            if (!topic || !platform) {
              return reply.status(400).send({
                statusCode: 400,
                error: "Validation Error",
                message:
                  "topic and platform are required for hashtag generation",
              });
            }
            aiResult = await generateHashtags({ topic, platform });
            break;
          }
          case "ideas": {
            if (!niche) {
              return reply.status(400).send({
                statusCode: 400,
                error: "Validation Error",
                message: "niche is required for idea generation",
              });
            }
            aiResult = await generateIdeas({ niche, count });
            break;
          }
          default:
            return reply.status(400).send({
              statusCode: 400,
              error: "Bad Request",
              message: "Unknown generation type",
            });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "AI generation failed";
        return reply.status(500).send({
          statusCode: 500,
          error: "Internal Server Error",
          message: `AI generation failed: ${message}`,
        });
      }

      // Store the generation in history
      const generation = await prisma.aiGeneration.create({
        data: {
          prompt: JSON.stringify({ type, topic, platform, tone, niche, count }),
          result: aiResult.result,
          type,
          tokens: aiResult.tokensUsed,
          workspaceId: request.workspaceId,
        },
      });

      return reply.status(201).send({
        id: generation.id,
        type,
        result: aiResult.result,
        tokens: aiResult.tokensUsed,
        createdAt: generation.createdAt,
      });
    }
  );

  // POST /ai/optimize
  fastify.post(
    "/ai/optimize",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = optimizeSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { content, analyticsContext } = parseResult.data;

      let aiResult: { result: string; tokensUsed: number };

      try {
        aiResult = await optimizeContent({ content, analyticsContext });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "AI optimization failed";
        return reply.status(500).send({
          statusCode: 500,
          error: "Internal Server Error",
          message: `AI optimization failed: ${message}`,
        });
      }

      const generation = await prisma.aiGeneration.create({
        data: {
          prompt: JSON.stringify({ content, analyticsContext }),
          result: aiResult.result,
          type: "optimization",
          tokens: aiResult.tokensUsed,
          workspaceId: request.workspaceId,
        },
      });

      return reply.status(201).send({
        id: generation.id,
        type: "optimization",
        result: aiResult.result,
        tokens: aiResult.tokensUsed,
        createdAt: generation.createdAt,
      });
    }
  );

  // GET /ai/history
  fastify.get(
    "/ai/history",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = historyQuery.safeParse(request.query);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { page, limit, type } = parseResult.data;
      const skip = (page - 1) * limit;

      const where = {
        workspaceId: request.workspaceId,
        ...(type ? { type } : {}),
      };

      const [generations, total] = await Promise.all([
        prisma.aiGeneration.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            type: true,
            prompt: true,
            result: true,
            tokens: true,
            createdAt: true,
          },
        }),
        prisma.aiGeneration.count({ where }),
      ]);

      return reply.send({
        generations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  );
}
