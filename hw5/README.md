# My-X - Twitter/X Clone

A Twitter/X-like social media application built with Next.js, MongoDB, Prisma, NextAuth, Pusher, and Cloudinary.

## Tech Stack

- **Next.js 14** (TypeScript) - Full-stack framework
- **NextAuth** - OAuth authentication
- **MongoDB Atlas** - Database
- **Prisma** - ORM
- **Pusher** - Real-time updates
- **Cloudinary** - Image uploads
- **Tailwind CSS** - Styling
- **Vercel** - Deployment

## Features

- OAuth authentication (Google, GitHub, Facebook)
- Custom userID registration
- Session management
- Create posts with character limits, hashtags, mentions, and links
- Like, comment, and repost posts
- Follow/unfollow users
- Real-time updates with Pusher
- Profile editing
- Recursive comments
- Drafts system

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Set up Prisma:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

See `.env.local.example` for required environment variables. Copy it to `.env.local` and fill in your values:

1. **NextAuth**: Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
2. **OAuth Providers**: Set up OAuth apps for Google, GitHub, and Facebook
3. **MongoDB Atlas**: Create a free cluster and get connection string
4. **Pusher**: Sign up at pusher.com and create a new app
5. **Cloudinary**: Sign up at cloudinary.com for image storage

## Deploy to Vercel

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

