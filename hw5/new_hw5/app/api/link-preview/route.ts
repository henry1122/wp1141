import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

interface PreviewResponse {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

const YOUTUBE_OEMBED = "https://www.youtube.com/oembed?format=json&url=";

const isYouTubeUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return host.includes("youtube.com") || host.includes("youtu.be");
  } catch (_) {
    return false;
  }
};

const fetchYouTubePreview = async (url: string): Promise<PreviewResponse | null> => {
  try {
    const response = await fetch(`${YOUTUBE_OEMBED}${encodeURIComponent(url)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      title: data.title,
      description: data.author_name,
      image: data.thumbnail_url,
      siteName: "YouTube",
    };
  } catch (error) {
    console.error("YouTube preview error:", error);
    return null;
  }
};

const fetchOpenGraphPreview = async (url: string): Promise<PreviewResponse | null> => {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    const getMeta = (property: string) => {
      const regex = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`, "i");
      const match = html.match(regex);
      if (match && match[1]) {
        return match[1];
      }
      const nameRegex = new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']*)["']`, "i");
      const nameMatch = html.match(nameRegex);
      return nameMatch && nameMatch[1] ? nameMatch[1] : undefined;
    };

    const getTitle = () => {
      const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      return titleTag && titleTag[1] ? titleTag[1] : undefined;
    };

    const title = getMeta("og:title") || getMeta("twitter:title") || getTitle();
    const description =
      getMeta("og:description") || getMeta("description") || getMeta("twitter:description");
    const image = getMeta("og:image") || getMeta("twitter:image");
    const siteName = getMeta("og:site_name");

    return {
      title,
      description,
      image,
      siteName,
    };
  } catch (error) {
    console.error("OpenGraph preview error:", error);
    return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const urlParam = request.nextUrl.searchParams.get("url");
    if (!urlParam) {
      return NextResponse.json({ error: "缺少 url" }, { status: 400 });
    }

    let url: URL;
    try {
      url = new URL(urlParam);
    } catch (_) {
      return NextResponse.json({ error: "URL 無效" }, { status: 400 });
    }

    let preview: PreviewResponse | null = null;

    if (isYouTubeUrl(url.href)) {
      preview = await fetchYouTubePreview(url.href);
    }

    if (!preview) {
      preview = await fetchOpenGraphPreview(url.href);
    }

    if (!preview) {
      return NextResponse.json({ url: url.href });
    }

    return NextResponse.json(preview);
  } catch (error) {
    console.error("Link preview error:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

