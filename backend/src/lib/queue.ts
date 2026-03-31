import { Queue } from "bullmq";
import { createRedisConnection } from "./redis.js";

const connection = createRedisConnection();

export const publishQueue = new Queue("publish", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: {
      age: 86400, // 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 604800, // 7 days
    },
  },
});

export const analyticsQueue = new Queue("analytics", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "fixed",
      delay: 10000,
    },
    removeOnComplete: {
      age: 3600,
      count: 500,
    },
    removeOnFail: {
      age: 86400,
    },
  },
});

publishQueue.on("error", (err) => {
  console.error("[PublishQueue] Error:", err.message);
});

analyticsQueue.on("error", (err) => {
  console.error("[AnalyticsQueue] Error:", err.message);
});
