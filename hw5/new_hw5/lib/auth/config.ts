import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

// 驗證必要的環境變數
function validateEnvVars() {
  const required = [
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "FACEBOOK_CLIENT_ID",
    "FACEBOOK_CLIENT_SECRET",
  ];

  const missing: string[] = [];
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error("💡 Please set these in Vercel Dashboard → Settings → Environment Variables");
  }

  return missing.length === 0;
}

// 在開發環境中驗證（生產環境會在構建時檢查）
if (process.env.NODE_ENV !== "production") {
  validateEnvVars();
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (!account || !user) return false;

      try {
        // 連接 MongoDB
        await dbConnect();

        const provider = account.provider as "google" | "github" | "facebook";
        const providerAccountId = account.providerAccountId;

        if (!providerAccountId) {
          console.error("No providerAccountId found");
          return false;
        }

        // 檢查是否已存在該 provider 的帳號
        const existingUser = await User.findOne({
          provider,
          providerAccountId,
        });

        if (!existingUser) {
          // 新使用者，建立記錄（但還沒有 userID，暫時用臨時 ID）
          // 使用完整的 providerAccountId 加上時間戳來確保唯一性
          const timestamp = Date.now().toString(36);
          const tempUserID = `temp_${provider}_${providerAccountId.substring(0, 8)}_${timestamp}`;
          
          try {
            await User.create({
              provider,
              providerAccountId,
              userID: tempUserID, // 臨時 userID，待註冊時更新
              name: user.name || profile?.name || "User",
              email: user.email || profile?.email,
              avatar: user.image || profile?.picture,
            });
          } catch (createError: any) {
            // 如果創建失敗，可能是因為重複的臨時 ID 或其他錯誤
            console.error("Error creating user:", createError);
            console.error("Error details:", {
              message: createError.message,
              code: createError.code,
              name: createError.name,
            });
            
            // 再次嘗試查找現有用戶（可能是在創建過程中已經被創建了）
            const duplicateUser = await User.findOne({
              provider,
              providerAccountId,
            });
            
            if (!duplicateUser) {
              // 如果找不到重複用戶，記錄詳細錯誤並返回 false
              console.error("Failed to create user and no duplicate found");
              console.error("User data:", {
                provider,
                providerAccountId,
                tempUserID,
                name: user.name,
                email: user.email,
              });
              return false;
            }
            // 如果找到重複用戶，繼續（可能是並發創建）
            console.log("User already exists, continuing...");
          }
        }

        return true;
      } catch (error: any) {
        console.error("Sign in error:", error);
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          name: error.name,
          stack: error.stack,
        });
        
        // 記錄詳細錯誤信息
        if (error.code === "ENOTFOUND") {
          console.error("❌ MongoDB connection error: Cannot resolve MongoDB hostname");
          console.error("💡 請檢查：");
          console.error("   1. MONGODB_URI 是否正確設定在 Vercel 環境變數");
          console.error("   2. 確認 MongoDB URI 格式：mongodb+srv://username:password@cluster.mongodb.net/dbname");
          console.error("   3. 確認網路連線正常");
          console.error("   4. 確認 MongoDB Atlas IP 白名單設定");
        } else if (error.code === 11000) {
          // MongoDB duplicate key error
          console.error("❌ MongoDB duplicate key error:", error.message);
          console.error("💡 這可能是 userID 衝突，嘗試重新查找用戶...");
          // 嘗試查找現有用戶
          try {
            const existingUser = await User.findOne({
              provider: account.provider as "google" | "github" | "facebook",
              providerAccountId: account.providerAccountId,
            });
            if (existingUser) {
              console.log("User found after duplicate error, continuing...");
              return true;
            }
          } catch (findError) {
            console.error("Error finding user after duplicate error:", findError);
          }
        }
        
        // MongoDB 連接失敗時，不允許登入（因為無法保存用戶資料）
        // 這樣可以確保資料一致性
        return false;
      }
    },
    async session({ session, token }: any) {
      if (session.user && token.provider && token.providerAccountId) {
        try {
          await dbConnect();

          const provider = token.provider as string;
          const providerAccountId = token.providerAccountId as string;

          const user = await User.findOne({
            provider,
            providerAccountId,
          });

          if (user) {
            session.user.id = (user as any)._id.toString();
            session.user.userID = (user as any).userID;
            session.user.provider = (user as any).provider;
            // 從資料庫獲取最新的頭像，而不是使用 OAuth 提供的頭像
            session.user.image = (user as any).avatar || session.user.image;
            // 檢查 userID 是否為臨時 ID（以 temp_ 開頭）
            const userID = (user as any).userID;
            session.user.hasUserID = !!userID && !userID.startsWith("temp_");
          }
        } catch (error) {
          console.error("Session error:", error);
        }
      }

      return session;
    },
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error", // 自定義錯誤頁面（相對於 app 目錄）
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || (() => {
    console.error("❌ NEXTAUTH_SECRET is not set!");
    console.error("💡 Please set NEXTAUTH_SECRET in Vercel Dashboard → Settings → Environment Variables");
    return "";
  })(),
  // NextAuth v5 自動檢測 URL，但如果設置了 NEXTAUTH_URL 則使用它
  // 為了支持預覽和生產環境，我們不強制設置信任Host
  trustHost: true,
};

// 導出 authOptions 供 API routes 使用
export { authOptions };

// 創建 auth 函數供 Server Components 和 API Routes 使用
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// 為了向後兼容，創建 getServerSession 函數
export async function getServerSession() {
  return await auth();
}
