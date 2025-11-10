"use client";

import Pusher from "pusher-js";

let pusherClientInstance: Pusher | null = null;

export function getPusherClient(): Pusher | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!pusherClientInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) {
      console.warn("Pusher client keys are not configured");
      return null;
    }

    pusherClientInstance = new Pusher(key, {
      cluster,
    });
  }

  return pusherClientInstance;
}

