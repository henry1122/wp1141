# My-X Setup Instructions

## Quick Start

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your credentials.

3. **Generate Prisma client and push schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Getting OAuth Credentials

### Google OAuth
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API (or Google Identity API)
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. **重要**: Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - ⚠️ 確保 URI 完全匹配，不要有多餘的斜線
   - ⚠️ 如果部署到 Vercel，也要添加生產環境的 URI
7. Copy Client ID and Client Secret
8. **如果遇到 redirect_uri_mismatch 錯誤**：
   - 檢查 Google Cloud Console 中的重定向 URI 是否完全匹配
   - 確保 `.env.local` 中有 `NEXTAUTH_URL=http://localhost:3000`
   - 清除瀏覽器快取後重試

### GitHub OAuth
1. Visit [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set:
   - Application name: My-X
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret

### Facebook OAuth
1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Go to Settings → Basic
5. Add platform "Website"
6. Set Site URL: `http://localhost:3000`
7. In Facebook Login settings, add Valid OAuth Redirect URIs:
   `http://localhost:3000/api/auth/callback/facebook`
8. Copy App ID and App Secret

## Getting MongoDB Atlas Connection String

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a free cluster (M0)
4. Create database user (username/password)
5. Whitelist IP: Add `0.0.0.0/0` for development (or your IP)
6. Click "Connect" → "Connect your application"
7. Copy connection string
8. Replace `<password>` with your database user password
9. Replace `<database>` with `my-x` or your preferred name

## Getting Pusher Credentials

1. Visit [Pusher Dashboard](https://dashboard.pusher.com/)
2. Sign up for free account
3. Create a new app
4. Go to "App Keys" tab
5. Copy:
   - App ID
   - Key
   - Secret
   - Cluster (e.g., `us2`)

## Getting Cloudinary Credentials

1. Visit [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Go to Dashboard
4. Copy:
   - Cloud name
   - API Key
   - API Secret

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in `.env.local`.

## Troubleshooting

### Prisma errors
- Make sure MongoDB connection string is correct
- Verify database user has proper permissions
- Check IP whitelist includes your current IP

### OAuth errors
- Verify redirect URIs match exactly (no trailing slashes)
- Check that OAuth apps are approved/published (especially Facebook)
- Make sure environment variables are set correctly

### Build errors
- Run `npx prisma generate` after schema changes
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Next Steps

After setup, you can:
- Start developing features
- Deploy to Vercel (see DEPLOYMENT.md)
- Customize the UI/UX
- Add more features


