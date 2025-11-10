"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

// 強制動態渲染
export const dynamic = "force-dynamic";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "伺服器配置錯誤，請聯繫管理員";
      case "AccessDenied":
        return "您沒有權限訪問此應用";
      case "Verification":
        return "驗證失敗，請重新嘗試";
      case "OAuthSignin":
        return "OAuth 登入失敗，請重新嘗試";
      case "OAuthCallback":
        return "OAuth 回調處理失敗";
      case "OAuthCreateAccount":
        return "無法創建帳號，請聯繫管理員";
      case "EmailCreateAccount":
        return "無法創建帳號，請聯繫管理員";
      case "Callback":
        return "回調處理失敗，請重新嘗試";
      case "OAuthAccountNotLinked":
        return "此帳號已與其他帳號關聯";
      case "EmailSignin":
        return "無法發送郵件，請檢查郵件設置";
      case "CredentialsSignin":
        return "登入憑證錯誤，請檢查您的帳號密碼";
      case "SessionRequired":
        return "請先登入";
      default:
        return error || "發生未知錯誤，請重新嘗試";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">登入錯誤</h1>
          <p className="mt-2 text-gray-600">{getErrorMessage(error)}</p>
        </div>

        <div className="space-y-4">
          <Link href="/login">
            <Button className="w-full">返回登入頁面</Button>
          </Link>
          {error && (
            <div className="rounded-md bg-gray-100 p-4">
              <p className="text-sm text-gray-600">錯誤代碼: {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div>載入中...</div>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

