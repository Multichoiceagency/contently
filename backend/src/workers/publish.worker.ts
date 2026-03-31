import { Worker, type Job } from "bullmq";
import { createRedisConnection } from "../lib/redis.js";
import { prisma } from "../lib/prisma.js";
import { getSocialService } from "../services/social/index.js";

interface PublishJobData {
  postId: string;
  workspaceId: string;
}

async function processPublishJob(job: Job<PublishJobData>): Promise<void> {
  const { postId, workspaceId } = job.data;

  console.log(
    `[PublishWorker] Processing publish job for post ${postId} (attempt ${job.attemptsMade + 1})`
  );

  // 1. Get post from DB
  const post = await prisma.post.findFirst({
    where: { id: postId, workspaceId },
  });

  if (!post) {
    console.error(`[PublishWorker] Post ${postId} not found, skipping`);
    return;
  }

  if (post.status === "published") {
    console.log(`[PublishWorker] Post ${postId} already published, skipping`);
    return;
  }

  // 2. Get social account for the platform
  const account = await prisma.socialAccount.findFirst({
    where: {
      workspaceId,
      platform: post.platform,
    },
  });

  if (!account) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: "failed",
        error: `No ${post.platform} account connected to this workspace`,
      },
    });
    console.error(
      `[PublishWorker] No ${post.platform} account found for workspace ${workspaceId}`
    );
    return;
  }

  // Check if token is expired
  if (account.expiresAt && account.expiresAt < new Date()) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: "failed",
        error: `${post.platform} account token is expired. Please reconnect the account.`,
      },
    });
    console.error(
      `[PublishWorker] ${post.platform} account token expired for workspace ${workspaceId}`
    );
    return;
  }

  // 3. Update status to publishing
  await prisma.post.update({
    where: { id: postId },
    data: { status: "publishing" },
  });

  // 4. Call social service to publish
  const service = getSocialService(post.platform);
  const result = await service.publish(
    { content: post.content, mediaUrls: post.mediaUrls },
    { accessToken: account.accessToken, refreshToken: account.refreshToken }
  );

  // 5. Update post status based on result
  if (result.success) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: "published",
        publishedAt: new Date(),
        externalId: result.externalId ?? null,
        error: null,
      },
    });
    console.log(
      `[PublishWorker] Post ${postId} published successfully to ${post.platform} (externalId: ${result.externalId})`
    );
  } else {
    // If this is the last attempt, mark as failed permanently
    const isLastAttempt = job.attemptsMade + 1 >= (job.opts.attempts ?? 3);

    if (isLastAttempt) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: "failed",
          error: result.error ?? "Unknown publishing error",
        },
      });
      console.error(
        `[PublishWorker] Post ${postId} failed permanently: ${result.error}`
      );
    } else {
      // Reset to scheduled so the retry picks it up
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: "scheduled",
          error: result.error ?? "Publishing failed, retrying...",
        },
      });
      console.warn(
        `[PublishWorker] Post ${postId} failed, will retry: ${result.error}`
      );
      throw new Error(result.error ?? "Publishing failed"); // Trigger BullMQ retry
    }
  }
}

export function startPublishWorker(): Worker<PublishJobData> {
  const worker = new Worker<PublishJobData>(
    "publish",
    processPublishJob,
    {
      connection: createRedisConnection(),
      concurrency: 5,
      limiter: {
        max: 10,
        duration: 60000, // 10 jobs per minute max
      },
    }
  );

  worker.on("completed", (job) => {
    console.log(`[PublishWorker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[PublishWorker] Job ${job?.id} failed: ${err.message}`
    );
  });

  worker.on("error", (err) => {
    console.error("[PublishWorker] Worker error:", err.message);
  });

  console.log("[PublishWorker] Started and listening for jobs");

  return worker;
}
