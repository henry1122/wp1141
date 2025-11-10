# 修复 GitHub OAuth Callback 错误

## 🔍 问题诊断

`error=Callback` 错误通常由以下原因造成：

### 1. GitHub OAuth App Callback URL 配置不正确 ⚠️ 最常见

**必须检查：**

1. 访问：https://github.com/settings/developers
2. 找到您的 OAuth App（Client ID: `Ov23li5FSncnEeL7QcHK`）
3. 点击进入应用设置
4. **确认 Authorization callback URL 设置为：**
   ```
   http://localhost:3000/api/auth/callback/github
   ```
   ⚠️ **必须完全匹配，包括：**
   - 协议：`http://`（不是 `https://`）
   - 域名：`localhost`（不是 `127.0.0.1`）
   - 端口：`3000`
   - 路径：`/api/auth/callback/github`（注意是 `/callback/github`，不是 `/callback`）

### 2. 环境变量检查

确认 `.env.local` 文件包含：

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=D2RHmhINY53O18ILccmzQGt0g4kwF1GzprYUWZ8H++Q=

# GitHub OAuth
GITHUB_ID=Ov23li5FSncnEeL7QcHK
GITHUB_SECRET=094892c87cd7337b9b47391658e3c3f6dfb0da92
```

### 3. 重启开发服务器

更新配置后，**必须重启**开发服务器：

1. 停止服务器（`Ctrl+C`）
2. 重新启动：`npm run dev`

### 4. 清除浏览器缓存

1. 按 `F12` 打开开发者工具
2. 在 **Application** 标签中：
   - 清除所有 **Cookies**
   - 清除 **Local Storage**
   - 清除 **Session Storage**
3. 或使用**无痕模式**测试

## 🔧 快速修复步骤

1. ✅ **确认 GitHub OAuth App Callback URL** 为 `http://localhost:3000/api/auth/callback/github`
2. ✅ **确认 `.env.local` 中的 GitHub 凭据正确**
3. ✅ **重启开发服务器**
4. ✅ **清除浏览器缓存**
5. ✅ **重新测试登录**

## 📝 如果问题仍然存在

请检查终端日志，应该会看到类似这样的信息：

```
[NextAuth SignIn] ===== Sign In Callback =====
[NextAuth SignIn] User email: ...
[NextAuth SignIn] Provider: github
```

如果没有看到这些日志，可能是：
- 数据库连接问题
- Prisma 配置问题
- NextAuth 配置问题

请分享终端中的完整错误信息。

