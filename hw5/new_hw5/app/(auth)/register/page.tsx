"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateUserID } from "@/lib/utils/validation";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userID, setUserID] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 如果未認證，立即導向登入頁面
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    // 如果已認證且有 userID，導向首頁
    if (status === "authenticated" && session?.user?.hasUserID) {
      router.push("/home");
      return;
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 驗證 UserID
    const validation = validateUserID(userID);
    if (!validation.valid) {
      setError(validation.error || "Invalid UserID");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "註冊失敗");
        setLoading(false);
        return;
      }

      // 註冊成功，重新整理 session 並導向首頁
      // 使用 window.location 強制重新載入頁面以更新 session
      window.location.href = "/home";
    } catch (error) {
      console.error("Register error:", error);
      setError("註冊時發生錯誤，請稍後再試");
      setLoading(false);
    }
  };

  // 如果正在載入或未認證，顯示載入中（會自動重定向）
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>載入中...</div>
      </div>
    );
  }

  // 如果已認證且有 userID，不應該看到這個頁面（會自動重定向）
  if (status === "authenticated" && session?.user?.hasUserID) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>載入中...</div>
      </div>
    );
  }

  // 只有當已認證但沒有 userID 時，才顯示註冊表單
  if (status === "authenticated" && !session?.user?.hasUserID) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold">建立帳號</h1>
            <p className="mt-2 text-gray-600">請設定您的 UserID</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userID" className="block text-sm font-medium text-gray-700">
                UserID
              </label>
              <Input
                id="userID"
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                placeholder="輸入 2-30 字元的 UserID"
                className="mt-1"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                只能包含英文字母、數字、底線和連字號
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "處理中..." : "註冊"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // 預設情況（不應該到達這裡，但以防萬一）
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>載入中...</div>
    </div>
  );
}

