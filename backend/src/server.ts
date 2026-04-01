import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";

import authPlugin from "./plugins/auth.js";
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspaces.js";
import postRoutes from "./routes/posts.js";
import aiRoutes from "./routes/ai.js";
import socialRoutes from "./routes/social.js";
import analyticsRoutes from "./routes/analytics.js";
import stripeRoutes from "./routes/stripe.js";
import { startPublishWorker } from "./workers/publish.worker.js";
import {
  startAnalyticsWorker,
  scheduleAnalyticsFetch,
} from "./workers/analytics.worker.js";

const PORT = parseInt(process.env.PORT ?? "4000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret-change-in-production";

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: { colorize: true },
            }
          : undefined,
    },
  });

  // --- Plugins ---

  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : true;
  await fastify.register(cors, {
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-workspace-id",
    ],
  });

  await fastify.register(jwt, {
    secret: JWT_SECRET,
    sign: {
      expiresIn: "15m",
    },
  });

  await fastify.register(cookie, {
    secret: JWT_SECRET,
  });

  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
      files: 5,
    },
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    keyGenerator: (request) => {
      return request.ip;
    },
  });

  // --- Auth plugin (decorates fastify with authenticate and requireWorkspace) ---

  await fastify.register(authPlugin);

  // --- Routes ---

  await fastify.register(authRoutes);
  await fastify.register(workspaceRoutes);
  await fastify.register(postRoutes);
  await fastify.register(aiRoutes);
  await fastify.register(socialRoutes);
  await fastify.register(analyticsRoutes);

  // Add raw body support for Stripe webhooks
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    (req, body, done) => {
      try {
        const json = JSON.parse(body as string);
        // Attach raw body for webhook signature verification
        (req as any).rawBody = body;
        done(null, json);
      } catch (err: any) {
        done(err, undefined);
      }
    }
  );

  await fastify.register(stripeRoutes);

  // --- Health check ---

  fastify.get("/health", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // --- Global error handler ---

  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode = error.statusCode ?? 500;

    if (statusCode >= 500) {
      fastify.log.error(error);
    } else {
      fastify.log.warn(error.message);
    }

    reply.status(statusCode).send({
      statusCode,
      error: error.name ?? "Error",
      message:
        statusCode >= 500 && process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : error.message,
    });
  });

  // --- 404 handler ---

  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  return fastify;
}

async function start() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`Flowgent API server running on http://${HOST}:${PORT}`);

    // Start background workers
    startPublishWorker();
    startAnalyticsWorker();
    await scheduleAnalyticsFetch();

    console.log("Background workers started");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    await fastify.close();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();
