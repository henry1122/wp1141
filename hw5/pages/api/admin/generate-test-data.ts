import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

// Generate random Chinese names and content
const randomNames = [
  '張三', '李四', '王五', '陳六', '劉七', '趙八', '孫九', '周十',
  '吳一', '鄭二', '錢三', '孫四', '李五', '周六', '吳七', '鄭八',
  '小明', '小華', '小美', '小強', '小紅', '小綠', '小藍', '小黃'
]

const randomPosts = [
  '今天天氣真好！',
  '剛剛吃了一碗拉麵，超好吃的！',
  '工作好累啊...',
  '有人要一起去看電影嗎？',
  '這個週末要去哪裡玩呢？',
  '剛剛看到一隻可愛的貓咪🐱',
  '今天學到了新東西，好開心！',
  '晚餐吃什麼好呢？',
  '好想放假啊...',
  '剛剛完成了一個專案，很有成就感！',
  '有人推薦好看的劇嗎？',
  '今天心情不錯～',
  '剛剛運動完，好累但很充實',
  '這個音樂好好聽！',
  '有人要一起打遊戲嗎？',
  '剛剛看到一個有趣的影片',
  '今天買了新衣服，好開心！',
  '有人要一起吃飯嗎？',
  '剛剛讀了一本好書',
  '今天學了新的技能',
  '有人要一起逛街嗎？',
  '剛剛完成了一個挑戰',
  '今天發現了一個好地方',
  '有人要一起聊天嗎？',
  '剛剛做了一個決定',
  '今天遇到了一個有趣的人',
  '有人要一起學習嗎？',
  '剛剛想到一個好點子',
  '今天完成了一個目標',
  '有人要一起分享嗎？'
]

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userCount = 10, postsPerUser = 5 } = req.body

    console.log(`開始生成 ${userCount} 個用戶，每個用戶 ${postsPerUser} 篇貼文...`)

    const createdUsers = []
    const createdPosts = []

    // Generate users
    for (let i = 0; i < userCount; i++) {
      const name = getRandomItem(randomNames)
      const userID = `user${i + 1}_${Math.random().toString(36).substring(2, 8)}`
      const email = `test${i + 1}@example.com`

      // Check if userID already exists
      const existingUser = await prisma.user.findUnique({
        where: { userID },
      })

      if (existingUser) {
        console.log(`用戶 ${userID} 已存在，跳過`)
        createdUsers.push(existingUser)
        continue
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          userID,
          email,
          name: `${name}${i + 1}`,
          provider: 'credentials',
          image: null,
        },
      })

      // Create account for user
      await prisma.account.create({
        data: {
          userId: user.id,
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: user.id,
        },
      })

      createdUsers.push(user)
      console.log(`✅ 創建用戶: ${user.userID} (${user.name})`)

      // Generate posts for this user
      const userPosts = getRandomItems(randomPosts, postsPerUser)
      for (const postContent of userPosts) {
        const post = await prisma.post.create({
          data: {
            content: postContent,
            authorId: user.id,
          },
        })
        createdPosts.push(post)
      }
    }

    console.log(`✅ 完成！創建了 ${createdUsers.length} 個用戶和 ${createdPosts.length} 篇貼文`)

    return res.status(200).json({
      success: true,
      message: `成功生成 ${createdUsers.length} 個用戶和 ${createdPosts.length} 篇貼文！`,
      stats: {
        usersCreated: createdUsers.length,
        postsCreated: createdPosts.length,
      },
      users: createdUsers.map(u => ({
        userID: u.userID,
        name: u.name,
        email: u.email,
      })),
    })
  } catch (error) {
    console.error('生成測試資料時發生錯誤：', error)
    return res.status(500).json({
      success: false,
      error: '生成測試資料失敗',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

