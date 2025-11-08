import { PrismaClient } from '@prisma/client'

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

