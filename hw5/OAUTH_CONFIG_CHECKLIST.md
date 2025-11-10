# OAuth 配置检查清单

根据参考网站 [Next.js OAuth Testing](https://ric2k1.notion.site/09-Next-js-OAuth-Testing-2970e6ef6182802182c9fce3d1efbd8d)，以下是完整的配置检查清单：

## ✅ 已完成的配置

### 1. NextAuth 配置文件
- ✅ `lib/auth.ts` - NextAuth 配置
- ✅ `pages/api/auth/[...nextauth].ts` - NextAuth API 路由
- ✅ 自定义页面配置：
  - ✅ `pages/auth/signin.tsx` - 登录页面
  - ✅ `pages/auth/register.tsx` - 注册页面
  - ✅ `pages/auth/error.tsx` - 错误页面（新添加）

### 2. OAuth Providers
- ✅ Google OAuth Provider
- ✅ GitHub OAuth Provider
- ✅ 配置了正确的 authorization 参数

### 3. Callbacks
- ✅ `signIn` callback - 处理登录逻辑
- ✅ `redirect` callback - 处理重定向逻辑
- ✅ `session` callback - 处理 session 数据
- ✅ `jwt` callback - 处理 JWT token（即使使用 database session）

### 4. Database Adapter
- ✅ PrismaAdapter 配置
- ✅ 数据库连接测试
- ✅ Session strategy: database

### 5. 环境变量
需要在 `.env.local` 中设置：
- ✅ `NEXTAUTH_URL=http://localhost:3000`
- ✅ `NEXTAUTH_SECRET` - 必须设置
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `GITHUB_ID`
- ✅ `GITHUB_SECRET`
- ✅ `DATABASE_URL` - MongoDB 连接字符串

## 🔍 需要检查的配置

### 1. Google OAuth 配置

访问 [Google Cloud Console](https://console.cloud.google.com/)：

1. **Authorized JavaScript origins** 必须包含：
   ```
   http://localhost:3000
   ```

2. **Authorized redirect URIs** 必须包含：
   ```
   http://localhost:3000/api/auth/callback/google
   ```

3. **如果部署到 Vercel**，还需要添加：
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/api/auth/callback/google
   ```

### 2. GitHub OAuth 配置

访问 [GitHub Developer Settings](https://github.com/settings/developers)：

1. **Authorization callback URL** 必须设置为：
   ```
   http://localhost:3000/api/auth/callback/github
   ```

2. **如果部署到 Vercel**，还需要添加：
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```

### 3. MongoDB Atlas 配置

1. **Network Access**：
   - 必须包含 `0.0.0.0/0`（允许所有 IP）或您的 IP 地址

2. **Database Access**：
   - 用户权限必须为 **Read and write to any database**

3. **DATABASE_URL 格式**：
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```
   - 注意：密码中的特殊字符需要 URL 编码（`@` → `%40`）

## 🚨 常见问题

### 问题 1: `error=Callback`

**可能原因：**
- 环境变量未正确设置
- 数据库连接失败
- OAuth Provider 配置错误

**解决方法：**
1. 检查 `.env.local` 文件
2. 重启开发服务器
3. 检查终端日志获取详细错误信息

### 问题 2: `error=Configuration`

**可能原因：**
- `NEXTAUTH_URL` 未设置
- `NEXTAUTH_SECRET` 未设置
- OAuth Provider 凭据错误

**解决方法：**
1. 确认所有环境变量都已设置
2. 重启开发服务器
3. 检查自定义错误页面 `/auth/error` 获取更多信息

### 问题 3: `redirect_uri_mismatch`

**可能原因：**
- OAuth Provider 的 callback URL 配置不正确

**解决方法：**
1. 检查 Google Cloud Console 或 GitHub Developer Settings
2. 确认 callback URL 完全匹配（包括协议、域名、端口、路径）

## 📝 测试步骤

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问登录页面**：
   ```
   http://localhost:3000/auth/signin
   ```

3. **测试 Google 登录**：
   - 点击 "Continue with Google"
   - 完成授权
   - 查看终端日志

4. **测试 GitHub 登录**：
   - 点击 "Continue with GitHub"
   - 完成授权
   - 查看终端日志

5. **检查错误页面**：
   - 如果出现错误，应该会跳转到 `/auth/error`
   - 查看错误信息

## ✅ 验证清单

- [ ] `.env.local` 文件包含所有必要的环境变量
- [ ] Google OAuth App 配置正确
- [ ] GitHub OAuth App 配置正确
- [ ] MongoDB Atlas 网络访问配置正确
- [ ] 开发服务器已重启
- [ ] 可以成功登录并跳转到注册页面或首页

