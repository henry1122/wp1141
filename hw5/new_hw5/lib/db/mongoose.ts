import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 使用全域變數快取連線，避免在開發環境重複建立連線
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  // 將環境變數檢查移到函數內部，避免構建時執行
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 秒超時
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    }).catch((error) => {
      console.error("❌ MongoDB connection error:", error.message);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", e.message);
    if (e.code === "ENOTFOUND") {
      console.error("💡 請檢查：");
      console.error("   1. MONGODB_URI 是否正確設定在 .env.local 或 Vercel 環境變數");
      console.error("   2. MongoDB hostname 是否正確");
      console.error("   3. 網路連線是否正常");
      console.error("   4. MongoDB Atlas IP 白名單設定");
    }
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

