import type { SocialPlatformService, SocialPublishResult, SocialMetrics } from "../../types/index.js";

export class FacebookService implements SocialPlatformService {
  private readonly graphApiVersion = "v19.0";
  private readonly baseUrl = `https://graph.facebook.com/${this.graphApiVersion}`;

  async publish(
    post: { content: string; mediaUrls: string[] },
    account: { accessToken: string; refreshToken?: string | null }
  ): Promise<SocialPublishResult> {
    try {
      // If there are media URLs, publish as a photo/album post
      if (post.mediaUrls.length > 0) {
        return await this.publishWithMedia(post, account);
      }

      // Text-only post
      const response = await fetch(`${this.baseUrl}/me/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: post.content,
          access_token: account.accessToken,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as {
          error?: { message?: string };
        };
        return {
          success: false,
          error: `Facebook API error: ${errorData.error?.message ?? response.statusText}`,
        };
      }

      const result = (await response.json()) as { id: string };

      return {
        success: true,
        externalId: result.id,
      };
    } catch (err) {
      return {
        success: false,
        error: `Facebook publish error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  private async publishWithMedia(
    post: { content: string; mediaUrls: string[] },
    account: { accessToken: string }
  ): Promise<SocialPublishResult> {
    try {
      if (post.mediaUrls.length === 1) {
        // Single photo post
        const response = await fetch(`${this.baseUrl}/me/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: post.mediaUrls[0],
            caption: post.content,
            access_token: account.accessToken,
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as {
            error?: { message?: string };
          };
          return {
            success: false,
            error: `Facebook photo API error: ${errorData.error?.message ?? response.statusText}`,
          };
        }

        const result = (await response.json()) as { id: string; post_id?: string };
        return {
          success: true,
          externalId: result.post_id ?? result.id,
        };
      }

      // Multiple photos: upload each as unpublished, then create album post
      const photoIds: string[] = [];

      for (const url of post.mediaUrls) {
        const response = await fetch(`${this.baseUrl}/me/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            published: false,
            access_token: account.accessToken,
          }),
        });

        if (!response.ok) {
          continue; // Skip failed uploads
        }

        const result = (await response.json()) as { id: string };
        photoIds.push(result.id);
      }

      // Create the multi-photo post
      const attachedMedia = photoIds.map((id) => ({
        media_fbid: id,
      }));

      const response = await fetch(`${this.baseUrl}/me/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: post.content,
          attached_media: attachedMedia,
          access_token: account.accessToken,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as {
          error?: { message?: string };
        };
        return {
          success: false,
          error: `Facebook multi-photo API error: ${errorData.error?.message ?? response.statusText}`,
        };
      }

      const result = (await response.json()) as { id: string };
      return {
        success: true,
        externalId: result.id,
      };
    } catch (err) {
      return {
        success: false,
        error: `Facebook media publish error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  async getMetrics(
    externalId: string,
    account: { accessToken: string; refreshToken?: string | null }
  ): Promise<SocialMetrics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${externalId}?fields=insights.metric(post_impressions,post_clicks,post_reactions_like_total),shares,comments.summary(true)&access_token=${account.accessToken}`
      );

      if (!response.ok) {
        console.error(`Facebook metrics fetch failed: ${response.status}`);
        return this.emptyMetrics();
      }

      const data = (await response.json()) as {
        insights?: {
          data?: Array<{ name: string; values?: Array<{ value: number }> }>;
        };
        shares?: { count?: number };
        comments?: { summary?: { total_count?: number } };
      };

      let impressions = 0;
      let clicks = 0;
      let likes = 0;

      if (data.insights?.data) {
        for (const metric of data.insights.data) {
          const value = metric.values?.[0]?.value ?? 0;
          switch (metric.name) {
            case "post_impressions":
              impressions = value;
              break;
            case "post_clicks":
              clicks = value;
              break;
            case "post_reactions_like_total":
              likes = value;
              break;
          }
        }
      }

      const shares = data.shares?.count ?? 0;
      const comments = data.comments?.summary?.total_count ?? 0;

      const totalEngagements = likes + shares + comments + clicks;
      const engagement =
        impressions > 0 ? totalEngagements / impressions : 0;

      return {
        impressions,
        clicks,
        likes,
        shares,
        comments,
        engagement,
      };
    } catch (err) {
      console.error("Facebook getMetrics error:", err);
      return this.emptyMetrics();
    }
  }

  private emptyMetrics(): SocialMetrics {
    return {
      impressions: 0,
      clicks: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      engagement: 0,
    };
  }
}
