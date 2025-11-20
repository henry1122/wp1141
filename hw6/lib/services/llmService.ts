import OpenAI from 'openai'
import { z } from 'zod'

const LLMConfigSchema = z.object({
  apiKey: z.string().min(1),
  model: z.string().default('gpt-3.5-turbo'),
  maxTokens: z.number().default(500),
  temperature: z.number().default(0.7),
})

export type LLMConfig = z.infer<typeof LLMConfigSchema>

export interface LLMResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface LLMError {
  type: 'quota' | 'rate_limit' | 'api_error' | 'network' | 'unknown'
  message: string
  retryable: boolean
}

export class LLMService {
  private client: OpenAI | null = null
  private config: LLMConfig

  constructor() {
    const config = {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      maxTokens: 500,
      temperature: 0.7,
    }

    this.config = LLMConfigSchema.parse(config)

    if (this.config.apiKey) {
      this.client = new OpenAI({
        apiKey: this.config.apiKey,
      })
    }
  }

  async generateResponse(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    systemPrompt?: string
  ): Promise<LLMResponse> {
    if (!this.client) {
      throw new Error('LLM service is not configured. Please set OPENAI_API_KEY.')
    }

    const startTime = Date.now()

    try {
      const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

      if (systemPrompt) {
        chatMessages.push({
          role: 'system',
          content: systemPrompt,
        })
      }

      messages.forEach((msg) => {
        chatMessages.push({
          role: msg.role,
          content: msg.content,
        })
      })

      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages: chatMessages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      })

      const responseTime = Date.now() - startTime

      const content = completion.choices[0]?.message?.content || '抱歉，我無法產生回應。'

      return {
        content,
        usage: completion.usage
          ? {
              promptTokens: completion.usage.prompt_tokens,
              completionTokens: completion.usage.completion_tokens,
              totalTokens: completion.usage.total_tokens,
            }
          : undefined,
      }
    } catch (error: any) {
      const llmError = this.parseError(error)
      throw llmError
    }
  }

  private parseError(error: any): LLMError {
    // Handle OpenAI API errors
    if (error?.status === 429) {
      return {
        type: 'rate_limit',
        message: 'API 請求過於頻繁，請稍後再試。',
        retryable: true,
      }
    }

    if (error?.status === 401 || error?.status === 403) {
      return {
        type: 'quota',
        message: 'API 配額已用完或無效的 API 金鑰。',
        retryable: false,
      }
    }

    if (error?.code === 'insufficient_quota') {
      return {
        type: 'quota',
        message: 'API 配額不足，請檢查您的帳戶設定。',
        retryable: false,
      }
    }

    if (error?.message?.includes('network') || error?.code === 'ECONNREFUSED') {
      return {
        type: 'network',
        message: '網路連線錯誤，請稍後再試。',
        retryable: true,
      }
    }

    return {
      type: 'api_error',
      message: error?.message || 'LLM 服務發生未知錯誤。',
      retryable: true,
    }
  }

  isAvailable(): boolean {
    return this.client !== null
  }
}

export const llmService = new LLMService()

