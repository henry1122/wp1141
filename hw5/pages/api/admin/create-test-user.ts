import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('正在創建測試用戶...')

    // 檢查是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { userID: 'testuser' },
    })

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: '測試用戶已存在',
        user: {
          userID: existingUser.userID,
          email: existingUser.email,
          name: existingUser.name,
        },
        loginInfo: {
          userID: 'testuser',
        },
      })
    }

    // 創建測試用戶
    const user = await prisma.user.create({
      data: {
        userID: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        provider: 'credentials',
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

    return res.status(200).json({
      success: true,
      message: '測試用戶創建成功！',
      user: {
        userID: user.userID,
        email: user.email,
        name: user.name,
      },
      loginInfo: {
        userID: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
      },
    })
  } catch (error) {
    console.error('❌ 創建用戶時發生錯誤：', error)
    return res.status(500).json({
      success: false,
      error: '創建用戶失敗',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

