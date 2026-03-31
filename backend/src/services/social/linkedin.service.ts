import type { SocialPlatformService, SocialPublishResult, SocialMetrics } from "../../types/index.js";

export class LinkedInService implements SocialPlatformService {
  private readonly baseUrl = "https://api.linkedin.com/v2";

  async publish(
    post: { content: string; mediaUrls: string[] },
    account: { accessToken: string; refreshToken?: string | null }
  ): Promise<SocialPublishResult> {
    try {
      // Get the authenticated user's profile URN
      const profileResponse = await fetch(`${this.baseUrl}/userinfo`, {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        return {
          success: false,
          error: `LinkedIn API error (profile): ${profileResponse.status} - ${errorText}`,
        };
      }

      const profile = (await profileResponse.json()) as { sub: string };
      const authorUrn = `urn:li:person:${profile.sub}`;

      // Build the share payload
      const sharePayload: Record<string, unknown> = {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: post.content,
            },
            shareMediaCategory:
              post.mediaUrls.length > 0 ? "IMAGE" : "NONE",
            ...(post.mediaUrls.length > 0
              ? {
                  media: post.mediaUrls.map((url) => ({
                    status: "READY",
                    originalUrl: url,
                  })),
                }
              : {}),
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };

      const publishResponse = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(sharePayload),
      });

      if (!publishResponse.ok) {
        const errorText = await publishResponse.text();
        return {
          success: false,
          error: `LinkedIn API error (publish): ${publishResponse.status} - ${errorText}`,
        };
      }

      const publishResult = (await publishResponse.json()) as { id: string };

      return {
        success: true,
        externalId: publishResult.id,
      };
    } catch (err) {
      return {
        success: false,
        error: `LinkedIn publish error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  async getMetrics(
    externalId: string,
    account: { accessToken: string; refreshToken?: string | null }
  ): Promise<SocialMetrics> {
    try {
      const encodedId = encodeURIComponent(externalId);
      const response = await fetch(
        `${this.baseUrl}/socialActions/${encodedId}`,
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      if (!response.ok) {
        console.error(
          `LinkedIn metrics fetch failed: ${response.status}`
        );
        return this.emptyMetrics();
      }

      const data = (await response.json()) as {
        likesSummary?: { totalLikes?: number };
        commentsSummary?: { totalFirstLevelComments?: number };
      };

      const likes = data.likesSummary?.totalLikes ?? 0;
      const comments =
        data.commentsSummary?.totalFirstLevelComments ?? 0;

      return {
        impressions: 0, // Requires organization analytics API
        clicks: 0,
        likes,
        shares: 0,
        comments,
        engagement: 0,
      };
    } catch (err) {
      console.error("LinkedIn getMetrics error:", err);
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
