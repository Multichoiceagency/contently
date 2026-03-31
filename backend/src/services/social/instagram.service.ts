import type { SocialPlatformService, SocialPublishResult, SocialMetrics } from "../../types/index.js";

export class InstagramService implements SocialPlatformService {
  private readonly graphApiVersion = "v19.0";
  private readonly baseUrl = `https://graph.facebook.com/${this.graphApiVersion}`;

  async publish(
    post: { content: string; mediaUrls: string[] },
    account: { accessToken: string; refreshToken?: string | null }
  ): Promise<SocialPublishResult> {
    try {
      // Step 1: Get the Instagram Business Account ID
      const accountsResponse = await fetch(
        `${this.baseUrl}/me/accounts?access_token=${account.accessToken}`
      );

      if (!accountsResponse.ok) {
        return {
          success: false,
          error: `Instagram API error: Could not fetch pages (${accountsResponse.status})`,
        };
      }

      const accountsData = (await accountsResponse.json()) as {
        data: Array<{ id: string }>;
      };

      if (!accountsData.data?.[0]?.id) {
        return {
          success: false,
          error: "No Facebook Page found linked to Instagram account",
        };
      }

      const pageId = accountsData.data[0].id;

      // Get the Instagram business account ID
      const igAccountResponse = await fetch(
        `${this.baseUrl}/${pageId}?fields=instagram_business_account&access_token=${account.accessToken}`
      );

      if (!igAccountResponse.ok) {
        return {
          success: false,
          error: `Instagram API error: Could not fetch IG account (${igAccountResponse.status})`,
        };
      }

      const igAccountData = (await igAccountResponse.json()) as {
        instagram_business_account?: { id: string };
      };

      const igAccountId = igAccountData.instagram_business_account?.id;
      if (!igAccountId) {
        return {
          success: false,
          error: "No Instagram Business Account found for this page",
        };
      }

      // Step 2: Create the media container
      if (post.mediaUrls.length === 0) {
        return {
          success: false,
          error: "Instagram requires at least one image or video",
        };
      }

      let containerId: string;

      if (post.mediaUrls.length === 1) {
        // Single image post
        const containerResponse = await fetch(
          `${this.baseUrl}/${igAccountId}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: post.mediaUrls[0],
              caption: post.content,
              access_token: account.accessToken,
            }),
          }
        );

        if (!containerResponse.ok) {
          const errData = (await containerResponse.json()) as {
            error?: { message?: string };
          };
          return {
            success: false,
            error: `Instagram container creation failed: ${errData.error?.message ?? containerResponse.statusText}`,
          };
        }

        const containerResult = (await containerResponse.json()) as {
          id: string;
        };
        containerId = containerResult.id;
      } else {
        // Carousel post: create individual items then combine
        const childIds: string[] = [];

        for (const url of post.mediaUrls.slice(0, 10)) {
          const childResponse = await fetch(
            `${this.baseUrl}/${igAccountId}/media`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                image_url: url,
                is_carousel_item: true,
                access_token: account.accessToken,
              }),
            }
          );

          if (childResponse.ok) {
            const childResult = (await childResponse.json()) as {
              id: string;
            };
            childIds.push(childResult.id);
          }
        }

        if (childIds.length === 0) {
          return {
            success: false,
            error: "Failed to upload any carousel items",
          };
        }

        // Create the carousel container
        const carouselResponse = await fetch(
          `${this.baseUrl}/${igAccountId}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              media_type: "CAROUSEL",
              children: childIds.join(","),
              caption: post.content,
              access_token: account.accessToken,
            }),
          }
        );

        if (!carouselResponse.ok) {
          const errData = (await carouselResponse.json()) as {
            error?: { message?: string };
          };
          return {
            success: false,
            error: `Instagram carousel creation failed: ${errData.error?.message ?? carouselResponse.statusText}`,
          };
        }

        const carouselResult = (await carouselResponse.json()) as {
          id: string;
        };
        containerId = carouselResult.id;
      }

      // Step 3: Publish the container
      const publishResponse = await fetch(
        `${this.baseUrl}/${igAccountId}/media_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: containerId,
            access_token: account.accessToken,
          }),
        }
      );

      if (!publishResponse.ok) {
        const errData = (await publishResponse.json()) as {
          error?: { message?: string };
        };
        return {
          success: false,
          error: `Instagram publish failed: ${errData.error?.message ?? publishResponse.statusText}`,
        };
      }

      const publishResult = (await publishResponse.json()) as {
        id: string;
      };

      return {
        success: true,
        externalId: publishResult.id,
      };
    } catch (err) {
      return {
        success: false,
        error: `Instagram publish error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  async getMetrics(
    externalId: string,
    account: { accessToken: string; refreshToken?: string | null }
  ): Promise<SocialMetrics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${externalId}/insights?metric=impressions,reach,likes,comments,shares,saved&access_token=${account.accessToken}`
      );

      if (!response.ok) {
        console.error(
          `Instagram metrics fetch failed: ${response.status}`
        );

        // Fallback to basic fields
        return this.getBasicMetrics(externalId, account.accessToken);
      }

      const data = (await response.json()) as {
        data: Array<{ name: string; values: Array<{ value: number }> }>;
      };

      let impressions = 0;
      let likes = 0;
      let comments = 0;
      let shares = 0;

      for (const metric of data.data) {
        const value = metric.values?.[0]?.value ?? 0;
        switch (metric.name) {
          case "impressions":
            impressions = value;
            break;
          case "likes":
            likes = value;
            break;
          case "comments":
            comments = value;
            break;
          case "shares":
            shares = value;
            break;
        }
      }

      const totalEngagements = likes + shares + comments;
      const engagement =
        impressions > 0 ? totalEngagements / impressions : 0;

      return {
        impressions,
        clicks: 0,
        likes,
        shares,
        comments,
        engagement,
      };
    } catch (err) {
      console.error("Instagram getMetrics error:", err);
      return this.emptyMetrics();
    }
  }

  private async getBasicMetrics(
    externalId: string,
    accessToken: string
  ): Promise<SocialMetrics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${externalId}?fields=like_count,comments_count&access_token=${accessToken}`
      );

      if (!response.ok) return this.emptyMetrics();

      const data = (await response.json()) as {
        like_count?: number;
        comments_count?: number;
      };

      return {
        impressions: 0,
        clicks: 0,
        likes: data.like_count ?? 0,
        shares: 0,
        comments: data.comments_count ?? 0,
        engagement: 0,
      };
    } catch {
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
