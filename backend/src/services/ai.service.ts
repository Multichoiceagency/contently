import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export interface GenerateCaptionParams {
  topic: string;
  platform: string;
  tone?: string;
}

export interface GenerateHashtagsParams {
  topic: string;
  platform: string;
}

export interface GenerateIdeasParams {
  niche: string;
  count?: number;
}

export interface OptimizeContentParams {
  content: string;
  analyticsContext?: {
    impressions: number;
    clicks: number;
    engagement: number;
  };
}

export interface AiResult {
  result: string;
  tokensUsed: number;
}

const PLATFORM_GUIDELINES: Record<string, string> = {
  linkedin:
    "Professional tone, business-oriented, ideal post length 150-300 words. Use line breaks for readability. Emojis are acceptable but keep it professional.",
  facebook:
    "Conversational and engaging. Ideal length 40-80 words. Use emojis and questions to drive engagement.",
  twitter:
    "Concise, punchy, under 280 characters. Use hashtags (2-3 max). Make it shareable and quote-worthy.",
  instagram:
    "Visual-first caption. Can be longer (up to 2200 chars). Use line breaks, emojis, and a strong call-to-action. Include 20-30 hashtags in a separate paragraph.",
};

export async function generateCaption(
  params: GenerateCaptionParams
): Promise<AiResult> {
  const { topic, platform, tone = "professional" } = params;
  const guidelines = PLATFORM_GUIDELINES[platform] ?? "";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a social media expert copywriter. Generate engaging content for ${platform}. ${guidelines}`,
      },
      {
        role: "user",
        content: `Write a ${tone} social media caption about: ${topic}

Respond with ONLY the caption text, no explanations or quotes around it.`,
      },
    ],
    max_tokens: 1000,
    temperature: 0.8,
  });

  const result = completion.choices[0]?.message?.content?.trim() ?? "";
  const tokensUsed = completion.usage?.total_tokens ?? 0;

  return { result, tokensUsed };
}

export async function generateHashtags(
  params: GenerateHashtagsParams
): Promise<AiResult> {
  const { topic, platform } = params;

  const hashtagCount =
    platform === "instagram"
      ? "20-30"
      : platform === "twitter"
        ? "3-5"
        : "5-10";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a social media hashtag strategist. Generate relevant, trending hashtags for ${platform}.`,
      },
      {
        role: "user",
        content: `Generate ${hashtagCount} relevant hashtags for the topic: ${topic}

Respond with ONLY the hashtags, each prefixed with #, separated by spaces. No explanations.`,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const result = completion.choices[0]?.message?.content?.trim() ?? "";
  const tokensUsed = completion.usage?.total_tokens ?? 0;

  return { result, tokensUsed };
}

export async function generateIdeas(
  params: GenerateIdeasParams
): Promise<AiResult> {
  const { niche, count = 5 } = params;
  const clampedCount = Math.min(Math.max(count, 1), 20);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a creative social media strategist who generates viral content ideas.",
      },
      {
        role: "user",
        content: `Generate ${clampedCount} unique social media content ideas for the niche: ${niche}

For each idea, provide:
- A catchy title
- A brief description (1-2 sentences)
- Suggested platform(s)

Format as a numbered list.`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.9,
  });

  const result = completion.choices[0]?.message?.content?.trim() ?? "";
  const tokensUsed = completion.usage?.total_tokens ?? 0;

  return { result, tokensUsed };
}

export async function optimizeContent(
  params: OptimizeContentParams
): Promise<AiResult> {
  const { content, analyticsContext } = params;

  let contextInfo = "";
  if (analyticsContext) {
    contextInfo = `

Current performance metrics:
- Impressions: ${analyticsContext.impressions}
- Clicks: ${analyticsContext.clicks}
- Engagement rate: ${(analyticsContext.engagement * 100).toFixed(1)}%`;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a social media optimization expert. Analyze content and provide actionable improvements to boost engagement.",
      },
      {
        role: "user",
        content: `Analyze and optimize this social media post:

"${content}"${contextInfo}

Provide:
1. An optimized version of the content
2. 3-5 specific improvement suggestions
3. Best time to post (day and time)
4. A score (1-10) for the original content`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.7,
  });

  const result = completion.choices[0]?.message?.content?.trim() ?? "";
  const tokensUsed = completion.usage?.total_tokens ?? 0;

  return { result, tokensUsed };
}
