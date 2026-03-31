import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import dayjs from "dayjs";
import { prisma } from "../lib/prisma.js";

const overviewQuery = z.object({
  from: z
    .string()
    .datetime()
    .optional()
    .default(() => dayjs().subtract(30, "day").toISOString()),
  to: z
    .string()
    .datetime()
    .optional()
    .default(() => dayjs().toISOString()),
});

const platformComparisonQuery = z.object({
  from: z
    .string()
    .datetime()
    .optional()
    .default(() => dayjs().subtract(30, "day").toISOString()),
  to: z
    .string()
    .datetime()
    .optional()
    .default(() => dayjs().toISOString()),
});

const bestTimesQuery = z.object({
  platform: z
    .enum(["linkedin", "facebook", "twitter", "instagram"])
    .optional(),
  days: z.coerce.number().int().min(7).max(90).default(30),
});

export default async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", fastify.requireWorkspace);

  // GET /analytics/overview
  fastify.get(
    "/analytics/overview",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = overviewQuery.safeParse(request.query);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { from, to } = parseResult.data;

      const analytics = await prisma.analytics.findMany({
        where: {
          workspaceId: request.workspaceId,
          fetchedAt: {
            gte: new Date(from),
            lte: new Date(to),
          },
        },
      });

      const totals = analytics.reduce(
        (acc, a) => ({
          impressions: acc.impressions + a.impressions,
          clicks: acc.clicks + a.clicks,
          likes: acc.likes + a.likes,
          shares: acc.shares + a.shares,
          comments: acc.comments + a.comments,
        }),
        { impressions: 0, clicks: 0, likes: 0, shares: 0, comments: 0 }
      );

      const totalEngagements =
        totals.likes + totals.shares + totals.comments + totals.clicks;
      const averageEngagement =
        totals.impressions > 0 ? totalEngagements / totals.impressions : 0;

      // Calculate trend: compare current period to previous period of same length
      const periodMs = new Date(to).getTime() - new Date(from).getTime();
      const previousFrom = new Date(
        new Date(from).getTime() - periodMs
      ).toISOString();
      const previousTo = from;

      const previousAnalytics = await prisma.analytics.findMany({
        where: {
          workspaceId: request.workspaceId,
          fetchedAt: {
            gte: new Date(previousFrom),
            lte: new Date(previousTo),
          },
        },
      });

      const previousTotals = previousAnalytics.reduce(
        (acc, a) => ({
          impressions: acc.impressions + a.impressions,
          clicks: acc.clicks + a.clicks,
          likes: acc.likes + a.likes,
          shares: acc.shares + a.shares,
          comments: acc.comments + a.comments,
        }),
        { impressions: 0, clicks: 0, likes: 0, shares: 0, comments: 0 }
      );

      function trendPercent(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      }

      const postCounts = await prisma.post.groupBy({
        by: ["status"],
        where: { workspaceId: request.workspaceId },
        _count: true,
      });

      return reply.send({
        totals,
        averageEngagement: Math.round(averageEngagement * 10000) / 100,
        trends: {
          impressions: trendPercent(
            totals.impressions,
            previousTotals.impressions
          ),
          clicks: trendPercent(totals.clicks, previousTotals.clicks),
          likes: trendPercent(totals.likes, previousTotals.likes),
          shares: trendPercent(totals.shares, previousTotals.shares),
          comments: trendPercent(totals.comments, previousTotals.comments),
        },
        posts: postCounts.reduce(
          (acc, p) => {
            acc[p.status] = p._count;
            return acc;
          },
          {} as Record<string, number>
        ),
        period: { from, to },
      });
    }
  );

  // GET /analytics/posts/:id
  fastify.get(
    "/analytics/posts/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const post = await prisma.post.findFirst({
        where: { id, workspaceId: request.workspaceId },
        select: {
          id: true,
          content: true,
          platform: true,
          status: true,
          publishedAt: true,
        },
      });

      if (!post) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Post not found",
        });
      }

      const analyticsRecords = await prisma.analytics.findMany({
        where: {
          postId: id,
          workspaceId: request.workspaceId,
        },
        orderBy: { fetchedAt: "asc" },
        select: {
          id: true,
          impressions: true,
          clicks: true,
          likes: true,
          shares: true,
          comments: true,
          engagement: true,
          fetchedAt: true,
        },
      });

      const latest =
        analyticsRecords.length > 0
          ? analyticsRecords[analyticsRecords.length - 1]
          : null;

      return reply.send({
        post,
        current: latest,
        history: analyticsRecords,
      });
    }
  );

  // GET /analytics/platforms
  fastify.get(
    "/analytics/platforms",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = platformComparisonQuery.safeParse(request.query);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { from, to } = parseResult.data;

      // Get analytics joined with posts to group by platform
      const posts = await prisma.post.findMany({
        where: {
          workspaceId: request.workspaceId,
          status: "published",
        },
        select: {
          id: true,
          platform: true,
          analytics: {
            where: {
              fetchedAt: {
                gte: new Date(from),
                lte: new Date(to),
              },
            },
            orderBy: { fetchedAt: "desc" },
            take: 1,
          },
        },
      });

      const platformMap: Record<
        string,
        {
          postCount: number;
          impressions: number;
          clicks: number;
          likes: number;
          shares: number;
          comments: number;
        }
      > = {};

      for (const post of posts) {
        if (!platformMap[post.platform]) {
          platformMap[post.platform] = {
            postCount: 0,
            impressions: 0,
            clicks: 0,
            likes: 0,
            shares: 0,
            comments: 0,
          };
        }

        const entry = platformMap[post.platform];
        entry.postCount += 1;

        if (post.analytics.length > 0) {
          const a = post.analytics[0];
          entry.impressions += a.impressions;
          entry.clicks += a.clicks;
          entry.likes += a.likes;
          entry.shares += a.shares;
          entry.comments += a.comments;
        }
      }

      const platforms = Object.entries(platformMap).map(
        ([platform, data]) => {
          const totalEngagements =
            data.likes + data.shares + data.comments + data.clicks;
          const engagementRate =
            data.impressions > 0
              ? Math.round((totalEngagements / data.impressions) * 10000) / 100
              : 0;

          return {
            platform,
            ...data,
            engagementRate,
          };
        }
      );

      return reply.send({
        platforms: platforms.sort((a, b) => b.impressions - a.impressions),
        period: { from, to },
      });
    }
  );

  // GET /analytics/best-times
  fastify.get(
    "/analytics/best-times",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = bestTimesQuery.safeParse(request.query);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Validation Error",
          message: parseResult.error.issues
            .map((i) => i.message)
            .join(", "),
        });
      }

      const { platform, days } = parseResult.data;

      const since = dayjs().subtract(days, "day").toDate();

      const posts = await prisma.post.findMany({
        where: {
          workspaceId: request.workspaceId,
          status: "published",
          publishedAt: { gte: since },
          ...(platform ? { platform } : {}),
        },
        select: {
          id: true,
          platform: true,
          publishedAt: true,
          analytics: {
            orderBy: { fetchedAt: "desc" },
            take: 1,
            select: {
              impressions: true,
              clicks: true,
              likes: true,
              shares: true,
              comments: true,
              engagement: true,
            },
          },
        },
      });

      // Group by day of week and hour
      const timeSlots: Record<
        string,
        { totalEngagement: number; count: number }
      > = {};

      for (const post of posts) {
        if (!post.publishedAt || post.analytics.length === 0) continue;

        const d = dayjs(post.publishedAt);
        const dayOfWeek = d.format("dddd");
        const hour = d.hour();
        const key = `${dayOfWeek}-${hour}`;

        if (!timeSlots[key]) {
          timeSlots[key] = { totalEngagement: 0, count: 0 };
        }

        const a = post.analytics[0];
        const engagement = a.likes + a.shares + a.comments + a.clicks;
        timeSlots[key].totalEngagement += engagement;
        timeSlots[key].count += 1;
      }

      const bestTimes = Object.entries(timeSlots)
        .map(([key, data]) => {
          const [day, hourStr] = key.split("-");
          const hour = parseInt(hourStr, 10);
          return {
            day,
            hour,
            timeLabel: `${day} ${hour.toString().padStart(2, "0")}:00`,
            averageEngagement:
              data.count > 0
                ? Math.round(data.totalEngagement / data.count)
                : 0,
            sampleSize: data.count,
          };
        })
        .sort((a, b) => b.averageEngagement - a.averageEngagement)
        .slice(0, 10);

      return reply.send({
        bestTimes,
        analyzedPosts: posts.length,
        period: {
          days,
          from: since.toISOString(),
          to: new Date().toISOString(),
        },
      });
    }
  );
}
