"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface LinkPreviewProps {
  url: string;
}

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

export default function LinkPreview({ url }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        if (response.ok) {
          const data = await response.json();
          setMetadata(data);
        }
      } catch (error) {
        console.error("Error fetching link metadata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  if (loading || !metadata) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline inline-flex items-center"
      >
        {url}
        <ExternalLink className="ml-1 h-3 w-3" />
      </a>
    );
  }

  // 檢查是否為 YouTube
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  
  if (isYouTube && metadata.image) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors mt-3 group"
      >
        <div className="relative w-full aspect-video bg-black">
          <Image
            src={metadata.image}
            alt={metadata.title || "YouTube Video"}
            fill
            className="object-cover"
            unoptimized
          />
          {/* YouTube 播放按鈕覆蓋層 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-4 h-4 bg-red-600 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-700">YouTube</span>
          </div>
          <p className="text-sm font-medium text-gray-900 line-clamp-2">{metadata.title || "YouTube Video"}</p>
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors mt-3"
    >
      {metadata.image && (
        <div className="relative w-full h-48 bg-gray-100">
          <Image
            src={metadata.image}
            alt={metadata.title || "Link preview"}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="p-4 bg-white">
        {metadata.siteName && (
          <p className="text-xs text-gray-500 uppercase mb-1">{metadata.siteName}</p>
        )}
        {metadata.title && (
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{metadata.title}</h3>
        )}
        {metadata.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{metadata.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-2 truncate">{url}</p>
      </div>
    </a>
  );
}

