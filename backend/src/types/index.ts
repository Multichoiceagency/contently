import type { FastifyRequest, FastifyReply } from "fastify";

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends FastifyRequest {
  userId: string;
  workspaceId: string;
  memberRole: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PostFilters {
  status?: string;
  platform?: string;
  from?: string;
  to?: string;
}

export interface SocialPublishResult {
  success: boolean;
  externalId?: string;
  error?: string;
}

export interface SocialMetrics {
  impressions: number;
  clicks: number;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
}

export interface SocialPlatformService {
  publish(post: { content: string; mediaUrls: string[] }, account: { accessToken: string; refreshToken?: string | null }): Promise<SocialPublishResult>;
  getMetrics(externalId: string, account: { accessToken: string; refreshToken?: string | null }): Promise<SocialMetrics>;
}

export interface AiGenerateRequest {
  type: "caption" | "hashtags" | "ideas" | "optimization";
  topic?: string;
  platform?: string;
  tone?: string;
  niche?: string;
  count?: number;
  content?: string;
  analyticsContext?: {
    impressions: number;
    clicks: number;
    engagement: number;
  };
}

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    workspaceId: string;
    memberRole: string;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
