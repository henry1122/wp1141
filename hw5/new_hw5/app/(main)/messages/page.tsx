"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPusherClient } from "@/lib/pusher/client";

interface Conversation {
  userId: string;
  user: {
    _id: string;
    name: string;
    userID: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
}

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    userID: string;
    avatar?: string;
  };
  receiverId: {
    _id: string;
    name: string;
    userID: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);

  // 從 URL 參數獲取 userId（用於從 Profile 頁面跳轉）
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("userId");
      if (userId) {
        setSelectedUserId(userId);
      }
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/messages");
      const data = await response.json();
      if (response.ok) {
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (userId: string) => {
      try {
        const response = await fetch(`/api/messages/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setMessages(data.messages || []);
          // 重新獲取對話列表以更新未讀數量
          fetchConversations();
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [fetchConversations]
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
      
      // 使用 Pusher 監聽新訊息
      if (typeof window !== "undefined" && session?.user?.id) {
        try {
          const pusher = getPusherClient();
          if (pusher) {
            const channel = pusher.subscribe(`user-${session.user.id}`);
            channel.bind("new-message", (data: any) => {
              if (data.senderId === selectedUserId || data.receiverId === selectedUserId) {
                fetchMessages(selectedUserId);
                fetchConversations();
              }
            });

            return () => {
              pusher.unsubscribe(`user-${session.user.id}`);
            };
          }
        } catch (error) {
          console.error("Pusher subscription error:", error);
        }
      }
    }
  }, [selectedUserId, fetchMessages, session?.user?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !selectedUserId) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUserId,
          content: messageContent,
        }),
      });

      if (response.ok) {
        setMessageContent("");
        fetchMessages(selectedUserId);
        fetchConversations();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl border-x flex h-screen">
        <div className="flex items-center justify-center flex-1">
          <div>載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl border-x flex h-screen">
      {/* 對話列表 */}
      <div className="w-80 border-r overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4">
          <h1 className="text-xl font-bold">{t("messages")}</h1>
        </div>
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t("noConversations")}</div>
        ) : (
          <div>
            {conversations.map((conv) => {
              const userId = typeof conv.userId === 'string' ? conv.userId : String(conv.userId);
              return (
                <button
                  key={userId}
                  onClick={() => setSelectedUserId(userId)}
                  className={`w-full p-4 border-b hover:bg-gray-50 text-left ${
                    selectedUserId === userId ? "bg-blue-50" : ""
                  }`}
                >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={conv.user.avatar || undefined} />
                    <AvatarFallback>
                      {conv.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{conv.user.name}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(new Date(conv.lastMessage.createdAt))}
                    </p>
                  </div>
                </div>
              </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 訊息內容 */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            {/* 訊息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId._id === session?.user?.id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwn
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTimeAgo(new Date(message.createdAt))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 輸入框 */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder={t("enterMessage")}
                  className="resize-none"
                  rows={2}
                  maxLength={1000}
                />
                <Button type="submit" disabled={!messageContent.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center text-gray-500">
              <p className="text-lg">{t("selectConversation")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

