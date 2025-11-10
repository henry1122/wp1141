import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only check DATABASE_URL on server side
if (typeof window === 'undefined') {
  // Check if DATABASE_URL is set (server-side only)
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL is not set')
    console.error('Please add DATABASE_URL to your .env.local file')
    console.error('Current env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')))
  } else {
    // Debug: log first 30 chars of DATABASE_URL (without password)
    const dbUrl = process.env.DATABASE_URL
    const maskedUrl = dbUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@')
    console.log('✅ DATABASE_URL loaded:', maskedUrl.substring(0, 50) + '...')
  }
}

// Only create PrismaClient on server side
let prisma: PrismaClient

if (typeof window === 'undefined') {
  // Server-side: create PrismaClient
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
} else {
  // Client-side: Prisma should never be used, but we need to export something
  // This should never happen in practice, but TypeScript needs it
  prisma = {} as PrismaClient
}

export { prisma }


