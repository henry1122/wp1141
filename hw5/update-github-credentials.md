# 更新 GitHub OAuth 凭据

## 新的 GitHub OAuth 凭据

- **Client ID**: `Ov23li5FSncnEeL7QcHK`
- **Client Secret**: `094892c87cd7337b9b47391658e3c3f6dfb0da92`

## 更新步骤

### 1. 更新 `.env.local` 文件

在项目根目录的 `.env.local` 文件中，更新以下内容：

```env
GITHUB_ID=Ov23li5FSncnEeL7QcHK
GITHUB_SECRET=094892c87cd7337b9b47391658e3c3f6dfb0da92
```

### 2. 确认 GitHub OAuth App 设置

访问：https://github.com/settings/developers

1. 找到您的 OAuth App
2. 确认 **Authorization callback URL** 设置为：
   ```
   http://localhost:3000/api/auth/callback/github
   ```
   ⚠️ **必须完全匹配，包括协议、端口和路径**

3. 如果部署到 Vercel，也需要添加生产环境的 URL：
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```

### 3. 重启开发服务器

更新 `.env.local` 后，必须重启开发服务器：

1. 停止当前服务器（按 `Ctrl+C`）
2. 重新启动：`npm run dev`

### 4. 清除浏览器缓存和 Cookies

在测试前，建议清除浏览器缓存和 cookies：
- 按 `F12` 打开开发者工具
- 在 Application/存储 标签中清除所有 cookies
- 或使用无痕模式测试

## 测试

1. 访问 `http://localhost:3000/auth/signin`
2. 点击 "Continue with GitHub"
3. 应该能正常跳转到 GitHub 授权页面
4. 授权后应该跳转回应用

