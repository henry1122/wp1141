"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Home, User, PlusCircle, LogOut, Bell, MessageSquare, Bookmark as BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import PostForm from "@/components/posts/PostForm";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleLogout = async () => {
    try {
      // 清除 session 並重定向到登入頁面
      await signOut({ 
        redirect: true,
        callbackUrl: "/login"
      });
    } catch (error) {
      console.error("登出錯誤:", error);
      // 如果 signOut 失敗，強制重定向
      router.push("/login");
      // 重新載入頁面以清除所有狀態
      window.location.href = "/login";
    }
  };

  // 檢查是否為臨時 userID（以 temp_ 開頭）
  const isTemporaryUserID = session?.user?.userID?.startsWith("temp_");
  const hasValidUserID = session?.user?.userID && !isTemporaryUserID;

  // 獲取未讀通知數量
  const fetchUnreadCount = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const res = await fetch("/api/notifications?limit=0");
        const data = await res.json();
        if (data.unreadCount !== undefined) {
          setUnreadNotifications(data.unreadCount);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }
  }, [session?.user?.id]);

  // 獲取未讀訊息總數
  const fetchUnreadMessages = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        if (res.ok && data.conversations) {
          const totalUnread = data.conversations.reduce(
            (sum: number, conv: any) => sum + (conv.unreadCount || 0),
            0
          );
          setUnreadMessages(totalUnread);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchUnreadCount();
    fetchUnreadMessages();
    
    // 使用 Pusher 監聽通知更新
    if (session?.user?.id && typeof window !== "undefined") {
      try {
        const { getPusherClient } = require("@/lib/pusher/client");
        const pusher = getPusherClient();
        if (pusher) {
          const channel = pusher.subscribe(`user-${session.user.id}`);
          channel.bind("notification", (data: any) => {
            // 如果 Pusher 事件包含 unreadCount，直接更新
            if (data?.unreadCount !== undefined) {
              setUnreadNotifications(data.unreadCount);
            } else {
              // 否則重新獲取
              fetchUnreadCount();
            }
          });

          // 監聽新訊息
          channel.bind("new-message", () => {
            fetchUnreadMessages();
          });

          return () => {
            pusher.unsubscribe(`user-${session.user.id}`);
          };
        }
      } catch (error) {
        console.error("Pusher subscription error:", error);
      }
    }
  }, [session?.user?.id, fetchUnreadCount, fetchUnreadMessages]);

  const menuItems = [
    { icon: Home, label: t("home"), href: "/home" },
    { 
      icon: User, 
      label: t("profile"), 
      href: hasValidUserID ? `/profile/${session.user.userID}` : "/home",
      disabled: !hasValidUserID // 如果沒有有效的 userID，禁用 Profile 連結
    },
    { icon: BookmarkIcon, label: t("bookmarks"), href: "/bookmarks" },
    { icon: Bell, label: t("notifications"), href: "/notifications", badge: unreadNotifications },
    { icon: MessageSquare, label: t("messages"), href: "/messages", badge: unreadMessages },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r bg-white p-4">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="mb-8 pl-2">
          <Link href="/home" className="flex items-center justify-center h-12 w-12 rounded-full hover:bg-gray-100 transition-colors">
            <span className="text-3xl font-bold text-gray-900">Y</span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const isDisabled = (item as any).disabled;

            if (isDisabled) {
              // 如果是 Profile 且沒有有效的 userID，點擊時重定向到註冊頁面
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    "cursor-pointer"
                  )}
                  onClick={() => router.push("/register")}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start relative",
                    isActive && "bg-gray-100"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                  {(item as any).badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {(item as any).badge > 99 ? "99+" : (item as any).badge}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
          
          {/* Post Button */}
          <Button
            onClick={() => setPostFormOpen(true)}
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <PlusCircle className="mr-3 h-5 w-5" />
            {t("post")}
          </Button>
        </nav>

        {/* Language Switcher */}
        <div className="mb-4">
          <LanguageSwitcher />
        </div>

        {/* User Info */}
        {session?.user && (
          <div className="mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="mr-3 h-8 w-8">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{session.user.name}</span>
                    {session.user.userID && (
                      <span className="text-xs text-gray-500">
                        @{isTemporaryUserID ? "未設定 UserID" : session.user.userID}
                      </span>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <PostForm open={postFormOpen} onOpenChange={setPostFormOpen} />
    </div>
  );
}

