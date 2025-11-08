# Deployment Guide for My-X

This guide will help you deploy My-X to Vercel.

## Prerequisites

1. GitHub account
2. Vercel account (sign up at vercel.com)
3. MongoDB Atlas account
4. Pusher account
5. Cloudinary account
6. OAuth credentials for Google, GitHub, and Facebook

## Step-by-Step Deployment

### 1. Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for Vercel)
5. Get your connection string
6. Replace `<password>` and `<database>` in the connection string

### 2. Set up OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs: `https://your-domain.vercel.app/api/auth/callback/facebook`

### 3. Set up Pusher

1. Go to [Pusher Dashboard](https://dashboard.pusher.com/)
2. Create a new app
3. Note your App ID, Key, Secret, and Cluster

### 4. Set up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Note your Cloud Name, API Key, and API Secret

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:

```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
DATABASE_URL=your-mongodb-connection-string
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=your-pusher-cluster
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

6. Click "Deploy"

### 6. Run Database Migrations

After deployment:

1. Go to your Vercel project settings
2. Open a terminal or use Vercel CLI
3. Run: `npx prisma db push`

Or use Vercel CLI:

```bash
vercel env pull
npx prisma generate
npx prisma db push
```

## Post-Deployment Checklist

- [ ] Verify OAuth callbacks are working
- [ ] Test user registration
- [ ] Test post creation
- [ ] Test real-time updates (open in two browsers)
- [ ] Verify image uploads work
- [ ] Check that sessions persist

## Troubleshooting

### OAuth not working
- Check redirect URIs match exactly
- Verify environment variables are set correctly
- Check Vercel logs for errors

### Database connection issues
- Verify MongoDB Atlas IP whitelist includes Vercel IPs
- Check connection string format
- Ensure database user has proper permissions

### Pusher not working
- Verify NEXT_PUBLIC_ variables are set (client-side)
- Check Pusher dashboard for app status
- Verify cluster matches in both server and client configs

### Image uploads failing
- Verify Cloudinary credentials
- Check file size limits (should be < 10MB)
- Verify API key permissions in Cloudinary

## Environment Variables Reference

All required environment variables are documented in `.env.local.example`. Make sure to set all of them in your Vercel project settings before deployment.


