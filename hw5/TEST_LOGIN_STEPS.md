# 测试登录步骤

## 📋 测试清单

### 步骤 1: 检查服务器状态

1. **查看终端**，应该看到：
   ```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Ready in X.Xs
   ```

2. **查看浏览器**，应该显示登录页面

### 步骤 2: 测试 Google 登录

1. 点击 "Continue with Google"
2. 完成 Google 授权
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

### 步骤 3: 测试 GitHub 登录

1. 清除浏览器 cookies（或使用无痕模式）
2. 点击 "Continue with GitHub"
3. 完成 GitHub 授权
4. **查看终端日志**，应该看到类似的日志

## 🔍 如果出现错误

### 错误 1: `error=Callback`

**查看终端日志**，应该会显示详细的错误信息：
- 如果看到 `❌ Database connection error`，说明数据库连接失败
- 如果看到 `❌ Missing session or session.user`，说明 session 创建失败
- 如果看到 `❌ Error in signIn callback`，说明 signIn 回调出错

**请分享完整的终端错误日志**

### 错误 2: 页面一直加载

- 检查终端是否有错误
- 检查浏览器控制台（F12）是否有错误
- 尝试刷新页面

### 错误 3: 重定向循环

- 清除浏览器 cookies
- 检查终端日志，查看 redirect callback 的日志

## 📝 需要检查的日志

请关注终端中的以下日志：

1. **启动日志**：
   - `✅ DATABASE_URL loaded`
   - `✅ PrismaAdapter initialized successfully`
   - `✅ Database connection successful`

2. **登录日志**：
   - `[NextAuth API] ===== Callback Request =====`
   - `[NextAuth SignIn] ===== Sign In Callback =====`
   - `[NextAuth Session] ===== Session Callback =====`

3. **错误日志**：
   - 任何以 `❌` 开头的错误
   - 任何数据库连接错误
   - 任何 Prisma 错误

## ✅ 成功标志

如果登录成功，应该：
1. 跳转到注册页面（如果没有 userID）
2. 或跳转到首页（如果已有 userID）
3. 终端显示所有步骤都成功完成

