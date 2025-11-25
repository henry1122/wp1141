import type { NextApiRequest, NextApiResponse } from 'next'
import { WebhookEvent, validateSignature } from '@line/bot-sdk'
import { lineService } from '@/lib/services/lineService'
import { llmService, LLMError } from '@/lib/services/llmService'
import { conversationService } from '@/lib/services/conversationService'
import { getContextualPrompt } from '@/lib/prompts/systemPrompt'
import { TextMessage } from '@line/bot-sdk'

export const config = {
  api: {
    bodyParser: false,
  },
}

// Fallback responses when LLM is unavailable
const FALLBACK_RESPONSES = {
  greeting:
    '你好！我是你的「AI 教學與筆記助理」📚\n\n我可以幫你：\n- 整理課程重點與筆記\n- 規劃學習/讀書計畫\n- 產生練習題與小測驗\n\n你可以直接點下方按鈕開始，或把上課內容、學習問題貼給我，我會幫你整理成清楚的重點與待辦清單。',
  default: '抱歉，我目前無法處理你的請求。請稍後再試，或嘗試重新發送訊息。',
  quota: '抱歉，AI 服務目前暫時無法使用（配額限制）。請稍後再試，或聯繫管理員。',
  error: '發生了一些錯誤，但我會繼續努力為你服務。請稍後再試。',
}

// Shared quick reply actions，用於所有回覆訊息
function buildQuickReplyMessage(text: string): TextMessage {
  return {
    type: 'text',
    text,
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'message',
            label: '📚 學習計畫',
            text: '學習計畫',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: '📝 整理課程重點',
            text: '重點整理',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: '🧩 小測驗',
            text: '測驗',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: '❓ 使用說明',
            text: '幫助',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: '🔚 結束對話',
            text: '結束對話',
          },
        },
      ],
    },
  }
}

function handleTextMessage(event: WebhookEvent): string {
  const text = lineService.extractTextMessage(event)
  if (!text) {
    return FALLBACK_RESPONSES.default
  }

  // Simple keyword-based fallback responses
  const lowerText = text.toLowerCase().trim()

  if (lowerText.includes('你好') || lowerText.includes('hi') || lowerText.includes('hello')) {
    return FALLBACK_RESPONSES.greeting
  }

  if (lowerText.includes('幫助') || lowerText.includes('help')) {
    return '我可以幫你：\n1. 📅 整理會議/課程重點\n2. ✅ 產生待辦事項清單\n3. 💡 擴充簡短想法\n\n只需將內容貼給我即可！'
  }

  // Education assistant helpers when LLM 不可用
  if (lowerText.includes('學習計畫') || lowerText.includes('讀書計畫') || lowerText.includes('study plan')) {
    return '讓我們一起排一個學習計畫吧 📚\n\n請告訴我：\n1. 你的目標（例如：兩週後考試、想補強哪一科）\n2. 每天可投入的時間\n3. 想要學習的章節或主題\n\n你也可以直接貼上課表，我會幫你整理成每日學習清單。'
  }

  if (lowerText.includes('重點整理') || lowerText.includes('課程筆記') || lowerText.includes('上課內容')) {
    return '想要幫你整理課程重點沒問題 ✏️\n\n請直接把上課內容、投影片文字或講義內容貼給我，我會幫你整理成：\n- 重點摘要\n- 待辦練習題\n- 結論與提醒\n\n也可以分段貼給我，我會幫你累積成同一份筆記。'
  }

  if (lowerText.includes('測驗') || lowerText.includes('小考') || lowerText.includes('quiz')) {
    return '來做個小測驗吧 📝\n\n請先告訴我科目與主題，例如：「國中數學 一元二次方程」或「英文 文法：現在完成式」。\n\n在 LLM 可用時，我會根據主題幫你出幾題選擇題與練習題，並附上解析；若 LLM 不可用，你也可以直接問我觀念題，我會用筆記方式幫你整理重點。'
  }

  return FALLBACK_RESPONSES.default
}

async function processMessage(event: WebhookEvent): Promise<void> {
  const userId = lineService.getUserId(event)
  const replyToken = lineService.getReplyToken(event)

  if (!userId || !replyToken) {
    console.error('Missing userId or replyToken')
    return
  }

  // Get or create user
  const userProfile = await lineService.getUserProfile(userId)
  const user = await conversationService.getOrCreateUser(userId, {
    displayName: userProfile?.displayName,
    pictureUrl: userProfile?.pictureUrl,
    statusMessage: userProfile?.statusMessage,
  })

  // Get active conversation or create new one
  let conversation = await conversationService.getActiveConversation(userId)

  if (!conversation) {
    conversation = await conversationService.createConversation(userId)
  }

  // Extract user message
  const userMessage = lineService.extractTextMessage(event)

  if (!userMessage) {
    // Handle non-text messages
    await lineService.replyMessage(
      replyToken,
      buildQuickReplyMessage('目前我只支援文字訊息，請傳送文字訊息給我。')
    )
    return
  }

  // Save user message
  const conversationId = (conversation._id as unknown as string).toString()

  await conversationService.addMessage(conversationId, {
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
    metadata: {
      messageId: event.type === 'message' ? event.message.id : undefined,
      replyToken,
    },
  })

  // Check for end-conversation command from user
  const normalizedText = userMessage.trim().toLowerCase()
  const cleanedText = normalizedText.replace(/[\s!！。．,，]/g, '')
  const isEndCommand =
    cleanedText === '結束' ||
    cleanedText === '結束對話' ||
    cleanedText === 'end' ||
    cleanedText === 'endchat' ||
    cleanedText === 'stop'

  if (isEndCommand) {
    await conversationService.endConversation(conversationId)

    const endMessage =
      '已為你結束這次對話 ✅\n\n若想重新開始，只要再傳一則新訊息給我，我會自動開啟新的對話。'

    await conversationService.addMessage(conversationId, {
      role: 'assistant',
      content: endMessage,
      timestamp: new Date(),
      metadata: {
        system: 'conversation_ended_by_user',
      },
    })

    await lineService.replyMessage(replyToken, buildQuickReplyMessage(endMessage))

    return
  }

  // Get recent messages for context (last 10 messages)
  const recentMessages = await conversationService.getRecentMessages(
    conversationId,
    10
  )

  // Prepare messages for LLM
  const llmMessages = recentMessages.map((msg) => ({
    role: msg.role as 'user' | 'assistant' | 'system',
    content: msg.content,
  }))

  let assistantResponse: string
  let llmUsed = false

  try {
    // Try to get response from LLM
    if (llmService.isAvailable()) {
      const systemPrompt = getContextualPrompt(user.displayName || undefined)
      const response = await llmService.generateResponse(llmMessages, systemPrompt)

      assistantResponse = response.content
      llmUsed = true

      await conversationService.updateStats('llm_call')
    } else {
      throw new Error('LLM service not available')
    }
  } catch (error) {
    // Handle LLM errors gracefully
    console.error('LLM error:', error)

    const llmError = error as LLMError

    if (llmError.type === 'quota') {
      assistantResponse = FALLBACK_RESPONSES.quota
    } else if (llmError.type === 'rate_limit') {
      assistantResponse = '抱歉，請求過於頻繁，請稍後再試。'
    } else {
      assistantResponse = handleTextMessage(event)
    }

    if (llmError.type === 'quota' || llmError.type === 'rate_limit') {
      await conversationService.updateStats('llm_error')
    }
  }

  // Save assistant response
  await conversationService.addMessage(conversationId, {
    role: 'assistant',
    content: assistantResponse,
    timestamp: new Date(),
    metadata: {
      llmUsed,
    },
  })

  // Reply to user
  await lineService.replyMessage(replyToken, buildQuickReplyMessage(assistantResponse))
}

async function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk.toString()
    })
    req.on('end', () => {
      resolve(data)
    })
    req.on('error', (error) => {
      reject(error)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // LINE Webhook 驗證（按下 Verify 時）有機會以 GET 發送請求
  // 為了通過驗證，對於非 POST 請求直接回傳 200
  if (req.method !== 'POST') {
    return res.status(200).json({ message: 'OK' })
  }

  try {
    // Get raw body for signature validation
    const rawBody = await getRawBody(req)
    const signature = req.headers['x-line-signature'] as string

    // Validate signature
    if (signature) {
      const channelSecret = process.env.LINE_CHANNEL_SECRET
      if (channelSecret) {
        const isValid = validateSignature(rawBody, channelSecret, signature)
        if (!isValid) {
          return res.status(401).json({ message: 'Invalid signature' })
        }
      }
    }

    // Parse webhook events
    const body = JSON.parse(rawBody)
    const events: WebhookEvent[] = body.events || []

    // Process each event
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        await processMessage(event)
      } else if (event.type === 'follow') {
        // Handle follow event (user adds bot as friend)
        const userId = lineService.getUserId(event)
        const replyToken = lineService.getReplyToken(event)

        if (userId && replyToken) {
          await lineService.replyMessage(replyToken, buildQuickReplyMessage(FALLBACK_RESPONSES.greeting))
        }
      }
    }

    res.status(200).json({ message: 'OK' })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

