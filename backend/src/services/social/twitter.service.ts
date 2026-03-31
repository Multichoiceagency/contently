import type { SocialPlatformService, SocialPublishResult, SocialMetrics } from "../../types/index.js";

export class TwitterService implements SocialPlatformService {
  private readonly baseUrl = "https://api.twitter.com/2";

  async publish(
    post: { content: string; mediaUrls: string[] },
    account: { accessToken: string; refreshToken?: string | null }
  ): Promise<SocialPublishResult> {
    try {
      const tweetPayload: Record<string, unknown> = {
        text: post.content,
      };

      // If there are media URLs, upload them first via the v1.1 media upload endpoint
      if (post.mediaUrls.length > 0) {
        const mediaIds = await this.uploadMedia(
          post.mediaUrls,
          account.accessToken
        );
        if (mediaIds.length > 0) {
          tweetPayload.media = { media_ids: mediaIds };
        }
      }

      const response = await fetch(`${this.baseUrl}/tweets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tweetPayload),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as {
          detail?: string;
          errors?: Array<{ message?: string }>;
        };
        const errorMessage =
          errorData.detail ??
          errorData.errors?.[0]?.message ??
          response.statusText;
        return {
          success: false,
          error: `Twitter API error: ${errorMessage}`,
        };
      }

      const result = (await response.json()) as {
        data: { id: string };
      };

      return {
        success: true,
        externalId: result.data.id,
      };
    } catch (err) {
      return {
        success: false,
        error: `Twitter publish error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  private async uploadMedia(
    mediaUrls: string[],
    accessToken: string
  ): Promise<string[]> {
    const mediaIds: string[] = [];

    for (const url of mediaUrls.slice(0, 4)) {
      // Twitter allows max 4 images
      try {
        // Download the image
        const imageResponse = await fetch(url);
        if (!imageResponse.ok) continue;

        const imageBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(imageBuffer).toString("base64");

        // Upload via v1.1 media upload
        const uploadResponse = await fetch(
          "https://upload.twitter.com/1.1/media/upload.json",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              media_data: base64,
            }),
          }
        );

        if (uploadResponse.ok) {
          const uploadResult = (await uploadResponse.json()) as {
            media_id_string: string;
          };
          mediaIds.push(uploadResult.media_id_string);
        }
      } catch (err) {
        console.error(`Failed to upload media to Twitter: ${url}`, err);
      }
    }

    return mediaIds;
  }

  async getMetrics(
    externalId: string,
    account: { accessToken: string; refreshToken?: string | null }
  ): Promise<SocialMetrics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/tweets/${externalId}?tweet.fields=public_metrics`,
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`Twitter metrics fetch failed: ${response.status}`);
        return this.emptyMetrics();
      }

      const data = (await response.json()) as {
        data: {
          public_metrics?: {
            retweet_count?: number;
            reply_count?: number;
            like_count?: number;
            impression_count?: number;
            bookmark_count?: number;
          };
        };
      };

      const metrics = data.data.public_metrics;
      if (!metrics) return this.emptyMetrics();

      const impressions = metrics.impression_count ?? 0;
      const likes = metrics.like_count ?? 0;
      const shares = metrics.retweet_count ?? 0;
      const comments = metrics.reply_count ?? 0;

      const totalEngagements = likes + shares + comments;
      const engagement =
        impressions > 0 ? totalEngagements / impressions : 0;

      return {
        impressions,
        clicks: 0, // Not available via public metrics
        likes,
        shares,
        comments,
        engagement,
      };
    } catch (err) {
      console.error("Twitter getMetrics error:", err);
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
