import type { SocialPlatformService } from "../../types/index.js";
import { LinkedInService } from "./linkedin.service.js";
import { FacebookService } from "./facebook.service.js";
import { TwitterService } from "./twitter.service.js";
import { InstagramService } from "./instagram.service.js";

const services: Record<string, SocialPlatformService> = {
  linkedin: new LinkedInService(),
  facebook: new FacebookService(),
  twitter: new TwitterService(),
  instagram: new InstagramService(),
};

export function getSocialService(platform: string): SocialPlatformService {
  const service = services[platform];
  if (!service) {
    throw new Error(`Unsupported social platform: ${platform}`);
  }
  return service;
}

export function getSupportedPlatforms(): string[] {
  return Object.keys(services);
}
