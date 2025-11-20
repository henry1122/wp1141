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
  greeting: '你好！我是你的「AI 筆記助理」。請把會議記錄、課程筆記或任何想法貼給我，我會幫你整理成結構化的重點筆記！\n\n試試看：傳送一段長文字給我。',
  default: '抱歉，我目前無法處理你的請求。請稍後再試，或嘗試重新發送訊息。',
  quota: '抱歉，AI 服務目前暫時無法使用（配額限制）。請稍後再試，或聯繫管理員。',
  error: '發生了一些錯誤，但我會繼續努力為你服務。請稍後再試。',
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
    await lineService.replyMessage(replyToken, {
      type: 'text',
      text: '目前我只支援文字訊息，請傳送文字訊息給我。',
    })
    return
  }

  // Save user message
  await conversationService.addMessage(conversation._id.toString(), {
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
    metadata: {
      messageId: event.type === 'message' ? event.message.id : undefined,
      replyToken,
    },
  })

  // Get recent messages for context (last 10 messages)
  const recentMessages = await conversationService.getRecentMessages(
    conversation._id.toString(),
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
  await conversationService.addMessage(conversation._id.toString(), {
    role: 'assistant',
    content: assistantResponse,
    timestamp: new Date(),
    metadata: {
      llmUsed,
    },
  })

  // Reply to user
  await lineService.replyMessage(replyToken, {
    type: 'text',
    text: assistantResponse,
  } as TextMessage)
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
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
          await lineService.replyMessage(replyToken, {
            type: 'text',
            text: FALLBACK_RESPONSES.greeting,
          })
        }
      }
    }

    res.status(200).json({ message: 'OK' })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

