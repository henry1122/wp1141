// Load environment variables from .env.local
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')
  envFile.split('\n').forEach(line => {
    // Skip comments and empty lines
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      return
    }
    // Match KEY=VALUE format
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (key && value && !process.env[key]) {
        process.env[key] = value
      }
    }
  })
  console.log('已載入 .env.local 文件')
  console.log('DATABASE_URL 已設定:', !!process.env.DATABASE_URL)
} else {
  console.error('找不到 .env.local 文件')
}

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('正在創建測試用戶...')

    // 檢查是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { userID: 'testuser' },
    })

    if (existingUser) {
      console.log('✅ 測試用戶已存在！')
      console.log('用戶資訊：')
      console.log('- userID: testuser')
      console.log('- Email:', existingUser.email || 'N/A')
      console.log('- Name:', existingUser.name || 'N/A')
      console.log('\n您可以使用以下資訊登入：')
      console.log('userID: testuser')
      return
    }

    // 創建測試用戶
    const user = await prisma.user.create({
      data: {
        userID: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        provider: 'credentials', // 使用 credentials 作為 provider
        image: null,
      },
    })

    // 創建一個假的 Account 記錄（NextAuth 需要）
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: user.id,
      },
    })

    console.log('✅ 測試用戶創建成功！')
    console.log('\n登入資訊：')
    console.log('userID: testuser')
    console.log('Email: test@example.com')
    console.log('Name: Test User')
    console.log('\n現在您可以使用 userID "testuser" 登入系統了！')
  } catch (error) {
    console.error('❌ 創建用戶時發生錯誤：', error)
    if (error instanceof Error) {
      console.error('錯誤訊息：', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()

