"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    // 檢查是否已登入
    getSession().then((session) => {
      if (session?.user) {
        if (session.user.hasUserID) {
          router.push("/home");
        } else {
          router.push("/register");
        }
      }
    });
  }, [router]);

  const handleOAuthSignIn = async (provider: "google" | "github" | "facebook") => {
    setLoading(provider);
    try {
      // 當 redirect: true 時，signIn 不會返回結果，會直接重定向
      // 所以不需要檢查返回結果
      await signIn(provider, {
        callbackUrl: "/register",
        redirect: true,
      });
      // 如果 redirect: true，這裡的代碼不會執行（因為已經重定向了）
    } catch (error) {
      console.error("Sign in error:", error);
      setLoading(null);
    }
    // 如果 redirect: false，這裡才需要 setLoading(null)
    // 但由於 redirect: true，這裡不會執行
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">welcome to Y</h1>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            disabled={!!loading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading === "google" ? "登入中..." : " Google "}
          </Button>

          {/* <Button
            className="w-full"
            variant="outline"
            onClick={() => handleOAuthSignIn("github")}
            disabled={!!loading}
          >
            <Github className="mr-2 h-4 w-4" />
            {loading === "github" ? "登入中..." : "使用 GitHub 登入"}
          </Button> */}

          {/* <Button
            className="w-full"
            variant="outline"
            onClick={() => handleOAuthSignIn("facebook")}
            disabled={!!loading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading === "facebook" ? "登入中..." : "使用 Facebook 登入"}
          </Button> */}
        </div>
      </div>
    </div>
  );
}

