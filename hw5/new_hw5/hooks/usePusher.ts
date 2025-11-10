"use client";

import { useEffect, useRef } from "react";
import { getPusherClient } from "@/lib/pusher/client";

export function usePusher(postId: string, onUpdate: (data: any) => void) {
  const channelRef = useRef<any>(null);
  const onUpdateRef = useRef(onUpdate);

  // 保持 onUpdate 的最新引用
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!postId || typeof window === "undefined") return;

    try {
      const pusher = getPusherClient();
      if (!pusher) return;

      const channel = pusher.subscribe(`post-${postId}`);
      channelRef.current = channel;

      const handleUpdate = (data: any) => {
        onUpdateRef.current(data);
      };

      channel.bind("like-updated", handleUpdate);
      channel.bind("repost-updated", handleUpdate);
      channel.bind("comment-added", handleUpdate);

      return () => {
        if (channelRef.current) {
          channel.unbind_all();
          pusher.unsubscribe(`post-${postId}`);
        }
      };
    } catch (error) {
      console.error("Pusher client error:", error);
    }
  }, [postId]);
}

