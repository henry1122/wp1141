# 测试指南

## 🚀 服务器已启动

开发服务器正在运行，浏览器应该已经打开。

## 📋 测试步骤

### 1. 检查服务器状态

**查看终端**，应该看到：
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

如果看到以下日志，说明配置正确：
```
✅ DATABASE_URL loaded: mongodb+srv://***:***@...
✅ PrismaAdapter initialized successfully
✅ Database connection successful
```

### 2. 测试 Google 登录

1. **在浏览器中**，点击 "Continue with Google"
2. **完成 Google 授权**
3. **立即查看终端日志**，应该看到：
   ```
   [NextAuth API] ===== Callback Request =====
   [NextAuth API] NEXTAUTH_URL: http://localhost:3000
   [NextAuth SignIn] ===== Sign In Callback =====
   [NextAuth SignIn] User email: ...
   [NextAuth SignIn] Provider: google
   [NextAuth SignIn] ✅ Database connection OK
   [NextAuth SignIn] ✅ Allowing sign in
   [NextAuth Session] ===== Session Callback =====
   [NextAuth Session] ✅ Database connection OK
   ```

### 3. 测试 GitHub 登录

1. **清除浏览器 cookies**（或使用无痕模式）
2. **点击 "Continue with GitHub"**
3. **完成 GitHub 授权**
4. **查看终端日志**

### 4. 预期结果

#### 成功情况：
- ✅ 如果用户没有 userID，应该跳转到 `/auth/register` 页面
- ✅ 如果用户已有 userID，应该跳转到首页 `/`
- ✅ 终端显示所有步骤都成功完成

#### 错误情况：
- ❌ 如果出现 `error=Callback`，会跳转到 `/auth/error` 页面
- ❌ 终端会显示详细的错误信息

## 🔍 如果出现错误

### 错误 1: `error=Callback`

**查看终端日志**，应该会显示：
- `❌ Database connection error` - 数据库连接失败
- `❌ Missing session or session.user` - Session 创建失败
- `❌ Error in signIn callback` - SignIn 回调出错

**解决方法：**
1. 检查 `.env.local` 文件中的环境变量
2. 确认 MongoDB Atlas 网络访问配置
3. 重启服务器

### 错误 2: `error=Configuration`

**查看 `/auth/error` 页面**，会显示需要检查的配置项。

**解决方法：**
1. 确认 `NEXTAUTH_URL` 和 `NEXTAUTH_SECRET` 已设置
2. 确认 OAuth Provider 凭据正确
3. 重启服务器

### 错误 3: `redirect_uri_mismatch`

**解决方法：**
1. 检查 Google Cloud Console 或 GitHub Developer Settings
2. 确认 callback URL 完全匹配

## 📝 需要分享的信息

如果测试失败，请分享：

1. **终端中的完整错误日志**（特别是以 `❌` 开头的错误）
2. **浏览器控制台中的错误**（按 F12 查看）
3. **错误页面的内容**（如果跳转到 `/auth/error`）

## ✅ 成功标志

如果登录成功，应该：
1. 跳转到注册页面（如果没有 userID）或首页（如果已有 userID）
2. 终端显示所有步骤都成功完成
3. 没有错误信息

