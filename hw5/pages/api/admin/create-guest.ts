import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET for easy access from browser
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('正在創建訪客帳號...')

    const guestUserID = 'guest'
    const guestEmail = 'guest@example.com'
    const guestName = 'Guest User'

    // 檢查是否已存在
    let existingUser = await prisma.user.findUnique({
      where: { userID: guestUserID },
      include: {
        accounts: {
          take: 1,
        },
      },
    })

    if (existingUser) {
      console.log('✅ 訪客帳號已存在！')
      return res.status(200).json({
        success: true,
        message: '訪客帳號已存在',
        user: {
          userID: existingUser.userID,
          email: existingUser.email,
          name: existingUser.name,
          id: existingUser.id,
        },
        loginInfo: {
          userID: guestUserID,
          message: '您可以使用 userID "guest" 登入',
        },
      })
    }

    // 創建訪客用戶
    const user = await prisma.user.create({
      data: {
        userID: guestUserID,
        email: guestEmail,
        name: guestName,
        provider: 'credentials',
        image: null,
      },
    })

    // 創建 Account 記錄（NextAuth 需要）
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: user.id,
      },
    })

    console.log('✅ 訪客帳號創建成功！')

    return res.status(200).json({
      success: true,
      message: '訪客帳號創建成功！',
      user: {
        userID: user.userID,
        email: user.email,
        name: user.name,
        id: user.id,
      },
      loginInfo: {
        userID: guestUserID,
        email: guestEmail,
        name: guestName,
        message: '現在您可以使用 userID "guest" 登入系統了！',
      },
    })
  } catch (error) {
    console.error('❌ 創建訪客帳號時發生錯誤：', error)
    
    // 提供更詳細的錯誤訊息
    let errorMessage = '創建失敗'
    if (error instanceof Error) {
      errorMessage = error.message
      console.error('錯誤詳情：', error.stack)
    }

    return res.status(500).json({
      success: false,
      error: '創建訪客帳號失敗',
      message: errorMessage,
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
      } : 'Unknown error',
      help: '請檢查：1. DATABASE_URL 是否正確設定 2. MongoDB Atlas 是否可訪問 3. IP 白名單是否包含您的 IP',
    })
  }
}

