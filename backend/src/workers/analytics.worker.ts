import { Worker, type Job } from "bullmq";
import { createRedisConnection } from "../lib/redis.js";
import { prisma } from "../lib/prisma.js";
import { getSocialService } from "../services/social/index.js";
import { analyticsQueue } from "../lib/queue.js";

interface AnalyticsJobData {
  workspaceId?: string; // If undefined, process all workspaces
}

async function processAnalyticsJob(
  job: Job<AnalyticsJobData>
): Promise<void> {
  const { workspaceId } = job.data;

  console.log(
    `[AnalyticsWorker] Starting analytics fetch${workspaceId ? ` for workspace ${workspaceId}` : " for all workspaces"}`
  );

  // 1. Get all published posts that have an externalId
  const whereClause = {
    status: "published",
    externalId: { not: null },
    ...(workspaceId ? { workspaceId } : {}),
  };

  const posts = await prisma.post.findMany({
    where: whereClause,
    select: {
      id: true,
      platform: true,
      externalId: true,
      workspaceId: true,
    },
  });

  console.log(
    `[AnalyticsWorker] Found ${posts.length} published posts to analyze`
  );

  let successCount = 0;
  let errorCount = 0;

  // 2. Fetch metrics for each post
  for (const post of posts) {
    if (!post.externalId) continue;

    try {
      // Get the social account for this platform and workspace
      const account = await prisma.socialAccount.findFirst({
        where: {
          workspaceId: post.workspaceId,
          platform: post.platform,
        },
      });

      if (!account) {
        console.warn(
          `[AnalyticsWorker] No ${post.platform} account for workspace ${post.workspaceId}, skipping post ${post.id}`
        );
        continue;
      }

      // Check if token is expired
      if (account.expiresAt && account.expiresAt < new Date()) {
        console.warn(
          `[AnalyticsWorker] ${post.platform} token expired for workspace ${post.workspaceId}, skipping`
        );
        continue;
      }

      // 3. Fetch metrics from social platform
      const service = getSocialService(post.platform);
      const metrics = await service.getMetrics(post.externalId, {
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
      });

      // 4. Store analytics record
      await prisma.analytics.create({
        data: {
          postId: post.id,
          workspaceId: post.workspaceId,
          impressions: metrics.impressions,
          clicks: metrics.clicks,
          likes: metrics.likes,
          shares: metrics.shares,
          comments: metrics.comments,
          engagement: metrics.engagement,
        },
      });

      successCount++;
    } catch (err) {
      errorCount++;
      console.error(
        `[AnalyticsWorker] Failed to fetch metrics for post ${post.id}:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  console.log(
    `[AnalyticsWorker] Completed: ${successCount} succeeded, ${errorCount} failed out of ${posts.length} posts`
  );
}

export function startAnalyticsWorker(): Worker<AnalyticsJobData> {
  const worker = new Worker<AnalyticsJobData>(
    "analytics",
    processAnalyticsJob,
    {
      connection: createRedisConnection(),
      concurrency: 2,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[AnalyticsWorker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[AnalyticsWorker] Job ${job?.id} failed: ${err.message}`
    );
  });

  worker.on("error", (err) => {
    console.error("[AnalyticsWorker] Worker error:", err.message);
  });

  console.log("[AnalyticsWorker] Started and listening for jobs");

  return worker;
}

/**
 * Schedule a recurring analytics fetch job.
 * This should be called once on server startup.
 * It adds a repeating job that runs every hour.
 */
export async function scheduleAnalyticsFetch(): Promise<void> {
  // Remove existing repeatable job to avoid duplicates
  const repeatableJobs = await analyticsQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    if (job.name === "fetch-all-analytics") {
      await analyticsQueue.removeRepeatableByKey(job.key);
    }
  }

  await analyticsQueue.add(
    "fetch-all-analytics",
    {},
    {
      repeat: {
        pattern: "0 * * * *", // Every hour at minute 0
      },
    }
  );

  console.log(
    "[AnalyticsWorker] Scheduled recurring analytics fetch (every hour)"
  );
}
