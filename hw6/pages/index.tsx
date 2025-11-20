import { useState, useEffect } from 'react'
import Head from 'next/head'
import { format } from 'date-fns'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

interface Conversation {
  _id: string
  lineUserId: string
  messages: Message[]
  status: 'active' | 'ended'
  createdAt: string
  updatedAt: string
}

interface Stats {
  today: {
    totalMessages: number
    totalUsers: number
    totalConversations: number
    llmCalls: number
    llmErrors: number
  }
  overall: {
    totalUsers: number
    totalConversations: number
    activeConversations: number
    totalMessages: number
  }
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [filter, setFilter] = useState({
    status: '' as '' | 'active' | 'ended',
    search: '',
  })

  useEffect(() => {
    fetchConversations()
    fetchStats()
    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchConversations()
      fetchStats()
    }, 5000)

    return () => clearInterval(interval)
  }, [filter])

  const fetchConversations = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.status) {
        params.append('status', filter.status)
      }
      if (filter.search) {
        params.append('lineUserId', filter.search)
      }

      const response = await fetch(`/api/conversations?${params.toString()}`)
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy/MM/dd HH:mm:ss')
  }

  return (
    <>
      <Head>
        <title>Line Bot 管理後台</title>
        <meta name="description" content="Line AI Chatbot Management Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Line Bot 管理後台</h1>
            <p className="mt-2 text-sm text-gray-600">監控對話、檢視統計、管理歷程</p>
          </div>
        </header>

        {/* Stats Section */}
        {stats && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">總使用者數</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.overall.totalUsers}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">總對話數</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.overall.totalConversations}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  進行中: {stats.overall.activeConversations}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">總訊息數</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.overall.totalMessages}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">今日 LLM 呼叫</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.today.llmCalls}</p>
                {stats.today.llmErrors > 0 && (
                  <p className="mt-1 text-sm text-red-500">錯誤: {stats.today.llmErrors}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="搜尋使用者 ID..."
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={filter.status}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        status: e.target.value as '' | 'active' | 'ended',
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">全部狀態</option>
                    <option value="active">進行中</option>
                    <option value="ended">已結束</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Conversations List */}
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center text-gray-500">載入中...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">尚無對話記錄</div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {conversation.lineUserId}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              conversation.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {conversation.status === 'active' ? '進行中' : '已結束'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          訊息數: {conversation.messages.length} | 建立於:{' '}
                          {formatDate(conversation.createdAt)}
                        </p>
                        {conversation.messages.length > 0 && (
                          <p className="mt-1 text-sm text-gray-600 truncate">
                            {conversation.messages[conversation.messages.length - 1].content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Conversation Detail Modal */}
        {selectedConversation && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedConversation(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">對話詳情</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedConversation.lineUserId} |{' '}
                    {formatDate(selectedConversation.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedConversation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="text-xs opacity-70 mb-1">
                        {message.role === 'user' ? '使用者' : '小智 (AI)'}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-2">
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

