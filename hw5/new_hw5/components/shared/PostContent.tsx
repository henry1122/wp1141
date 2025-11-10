"use client";

import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import LinkPreview from "./LinkPreview";

interface PostContentProps {
  content: string;
  hashtags?: string[];
  mentions?: string[];
  links?: Array<{ url: string; displayLength: number }>;
  showLinkPreview?: boolean; // 是否顯示連結預覽
}

export default function PostContent({
  content,
  hashtags = [],
  mentions = [],
  links = [],
  showLinkPreview = true,
}: PostContentProps) {
  // 將內容中的 hashtags、mentions 和 links 轉換為可點擊的連結
  let processedContent = content;

  // 處理 Hashtags
  hashtags.forEach((tag) => {
    const regex = new RegExp(`#${tag}\\b`, "gi");
    processedContent = processedContent.replace(
      regex,
      `<a href="/hashtag/${tag}" class="text-blue-500 hover:underline">#${tag}</a>`
    );
  });

  // 處理 Mentions
  mentions.forEach((mention) => {
    const regex = new RegExp(`@${mention}\\b`, "gi");
    processedContent = processedContent.replace(
      regex,
      `<a href="/profile/${mention}" class="text-blue-500 hover:underline">@${mention}</a>`
    );
  });

  // 處理 Links
  links.forEach((link) => {
    processedContent = processedContent.replace(
      link.url,
      `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${link.url}</a>`
    );
  });

  // 處理換行
  processedContent = processedContent.replace(/\n/g, "<br />");

  // 清理 HTML（防止 XSS）
  const sanitizedContent = DOMPurify.sanitize(processedContent, {
    ALLOWED_TAGS: ["a", "br"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 如果點擊的是連結，阻止事件冒泡到外層
    const target = e.target as HTMLElement;
    if (target.tagName === "A") {
      e.stopPropagation();
    }
  };

  // 獲取第一個連結（用於預覽）
  const firstLink = links && links.length > 0 ? links[0].url : null;

  return (
    <div>
      <div
        className="whitespace-pre-wrap break-words cursor-pointer"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        onClick={handleClick}
      />
      {/* 連結預覽（只顯示第一個） */}
      {showLinkPreview && firstLink && (
        <LinkPreview url={firstLink} />
      )}
    </div>
  );
}
