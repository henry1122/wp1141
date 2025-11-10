"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils/format";
import { Heart, Repeat2, MessageCircle, UserPlus } from "lucide-react";

interface Notification {
  _id: string;
  type: "like" | "repost" | "reply" | "follow";
  actorId: {
    _id: string;
    name: string;
    userID: string;
    avatar?: string;
  };
  postId?: {
    _id: string;
    content: string;
  };
  read: boolean;
  createdAt: string;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds }),
      });

      if (response.ok) {
        // 更新本地狀態
        setNotifications((prev) =>
          prev.map((n) =>
            notificationIds.includes(n._id) ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "repost":
        return <Repeat2 className="h-5 w-5 text-green-500" />;
      case "reply":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const actorName = notification.actorId.name;
    const actorUserID = notification.actorId.userID;

    switch (notification.type) {
      case "like":
        return (
          <>
            <Link
              href={`/profile/${actorUserID}`}
              className="font-semibold hover:underline"
            >
              {actorName}
            </Link>{" "}
            按讚了你的文章
          </>
        );
      case "repost":
        return (
          <>
            <Link
              href={`/profile/${actorUserID}`}
              className="font-semibold hover:underline"
            >
              {actorName}
            </Link>{" "}
            轉發了你的文章
          </>
        );
      case "reply":
        return (
          <>
            <Link
              href={`/profile/${actorUserID}`}
              className="font-semibold hover:underline"
            >
              {actorName}
            </Link>{" "}
            回覆了你的文章
          </>
        );
      case "follow":
        return (
          <>
            <Link
              href={`/profile/${actorUserID}`}
              className="font-semibold hover:underline"
            >
              {actorName}
            </Link>{" "}
            開始追蹤你
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div>
      {unreadCount > 0 && (
        <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm px-4 py-3">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            標記全部為已讀
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">尚無通知</div>
        </div>
      ) : (
        <div>
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`border-b p-4 hover:bg-gray-50 ${
                !notification.read ? "bg-blue-50" : ""
              }`}
              onClick={() => {
                if (!notification.read) {
                  markAsRead([notification._id]);
                }
                if (notification.postId) {
                  window.location.href = `/post/${notification.postId._id}`;
                }
              }}
            >
              <div className="flex space-x-3">
                <Link href={`/profile/${notification.actorId.userID}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={notification.actorId.avatar || undefined}
                    />
                    <AvatarFallback>
                      {notification.actorId.name?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex-1">
                  <div className="flex items-start space-x-2">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm">
                        {getNotificationText(notification)}
                      </p>
                      {notification.postId && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {notification.postId.content}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {formatTimeAgo(new Date(notification.createdAt))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


