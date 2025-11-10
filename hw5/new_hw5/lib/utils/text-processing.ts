/**
 * 解析文字中的 Hashtag
 */
export function parseHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  if (!matches) return [];

  // 移除 # 符號並去重
  const hashtags = matches.map((tag) => tag.substring(1).toLowerCase());
  return [...new Set(hashtags)];
}

/**
 * 解析文字中的 Mention (@userID)
 */
export function parseMentions(text: string): string[] {
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  const matches = text.match(mentionRegex);
  if (!matches) return [];

  // 移除 @ 符號並去重
  const mentions = matches.map((mention) => mention.substring(1));
  return [...new Set(mentions)];
}

/**
 * 解析文字中的連結
 */
export function parseLinks(text: string): Array<{ url: string; displayLength: number }> {
  // URL 正則表達式（支援 http/https）
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  if (!matches) return [];

  // 去重並格式化
  const uniqueUrls = [...new Set(matches)];
  return uniqueUrls.map((url) => ({
    url,
    displayLength: 23, // 固定 23 字元
  }));
}

/**
 * 計算文章字元數（Hashtag 和 Mention 不計入，連結固定 23 字元）
 */
export function calculateCharacterCount(text: string): number {
  let count = text.length;

  // 移除 Hashtag 的字元數
  const hashtags = parseHashtags(text);
  hashtags.forEach((tag) => {
    count -= tag.length + 1; // +1 是 # 符號
  });

  // 移除 Mention 的字元數
  const mentions = parseMentions(text);
  mentions.forEach((mention) => {
    count -= mention.length + 1; // +1 是 @ 符號
  });

  // 移除連結的實際長度，加上固定 23 字元
  const links = parseLinks(text);
  links.forEach((link) => {
    count = count - link.url.length + link.displayLength;
  });

  return Math.max(0, count);
}

/**
 * 驗證文章內容是否超過字元限制
 */
export function validatePostContent(text: string): { valid: boolean; count: number; error?: string } {
  const count = calculateCharacterCount(text);

  if (count > 280) {
    return {
      valid: false,
      count,
      error: `文章內容超過 280 字元限制（目前：${count} 字元）`,
    };
  }

  return { valid: true, count };
}

