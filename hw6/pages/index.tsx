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

type Language = 'zh' | 'en'

const translations: Record<Language, Record<string, string>> = {
  zh: {
    dashboardTitle: 'Line Bot 管理後台',
    dashboardSubtitle: '監控對話、檢視統計、管理歷程',
    totalUsers: '總使用者數',
    totalConversations: '總對話數',
    totalMessages: '總訊息數',
    todayLlmStatus: '今日 LLM 狀態',
    llmErrors: '錯誤',
    llmSuccessRate: '成功率',
    todayStatsTitle: '今日統計',
    todayUsers: '今日使用者',
    todayConversations: '今日對話',
    todayMessages: '今日訊息',
    searchPlaceholder: '搜尋使用者 ID...',
    statusAll: '全部狀態',
    statusActive: '進行中',
    statusEnded: '已結束',
    loading: '載入中...',
    noConversations: '尚無對話記錄',
    conversationDetail: '對話詳情',
    user: '使用者',
    assistant: '小智 (AI)',
    messagesCount: '訊息數',
    createdAt: '建立於',
    endConversation: '結束對話',
    filterSummaryPrefix: '顯示中',
    filterSummarySuffix: '筆對話',
    lastUpdated: '最後更新',
    themeLabel: '背景',
    themeLight: '淺色',
    themeDark: '深色',
    langZh: '中',
    langEn: 'EN',
    active: '進行中',
    ended: '已結束',
  },
  en: {
    dashboardTitle: 'Line Bot Dashboard',
    dashboardSubtitle: 'Monitor conversations, view stats, manage history',
    totalUsers: 'Total Users',
    totalConversations: 'Total Conversations',
    totalMessages: 'Total Messages',
    todayLlmStatus: 'Today LLM Status',
    llmErrors: 'Errors',
    llmSuccessRate: 'Success Rate',
    todayStatsTitle: 'Today Summary',
    todayUsers: 'Users Today',
    todayConversations: 'Conversations Today',
    todayMessages: 'Messages Today',
    searchPlaceholder: 'Search by User ID...',
    statusAll: 'All Status',
    statusActive: 'Active',
    statusEnded: 'Ended',
    loading: 'Loading...',
    noConversations: 'No conversations yet',
    conversationDetail: 'Conversation Detail',
    user: 'User',
    assistant: 'Assistant (AI)',
    messagesCount: 'Messages',
    createdAt: 'Created at',
    endConversation: 'End Conversation',
    filterSummaryPrefix: 'Showing',
    filterSummarySuffix: 'conversations',
    lastUpdated: 'Last updated',
    themeLabel: 'Background',
    themeLight: 'Light',
    themeDark: 'Dark',
    langZh: '中',
    langEn: 'EN',
    active: 'Active',
    ended: 'Ended',
  },
}

type TranslationKey = keyof typeof translations.zh

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [language, setLanguage] = useState<Language>('zh')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filteredTotal, setFilteredTotal] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    status: '' as '' | 'active' | 'ended',
    search: '',
  })

  const t = (key: TranslationKey): string => translations[language][key]

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
      setFilteredTotal(data.total || data.conversations?.length || 0)
      setLastUpdated(new Date().toISOString())
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')

      if (!response.ok) {
        console.error('Failed to fetch stats: non-200 response', response.status)
        return
      }

      const data = await response.json()

      // 防禦性檢查：確保結構正確才設定，避免前端因為後端錯誤結構而當掉
      if (!data?.overall || !data?.today) {
        console.error('Invalid stats data received:', data)
        return
      }

      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const endConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        console.error('Failed to end conversation:', response.status)
        return
      }

      // 關閉對話並重新載入列表與統計
      setSelectedConversation(null)
      await fetchConversations()
      await fetchStats()
    } catch (error) {
      console.error('Failed to end conversation:', error)
    }
  }

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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy/MM/dd HH:mm:ss')
  }

  const pageBgClass =
    theme === 'light'
      ? 'bg-gray-50'
      : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'

  const headerBgClass = theme === 'light' ? 'bg-white' : 'bg-slate-900/80 backdrop-blur'
  const headerTitleClass = theme === 'light' ? 'text-gray-900' : 'text-white'
  const headerSubtitleClass = theme === 'light' ? 'text-gray-600' : 'text-slate-300'

  return (
    <>
      <Head>
        <title>Line Bot 管理後台</title>
        <meta name="description" content="Line AI Chatbot Management Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`min-h-screen ${pageBgClass}`}>
        {/* Header */}
        <header className={`${headerBgClass} shadow`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-bold ${headerTitleClass}`}>{t('dashboardTitle')}</h1>
                <p className={`mt-2 text-sm ${headerSubtitleClass}`}>{t('dashboardSubtitle')}</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Language toggle */}
                <div className="inline-flex rounded-md bg-white/80 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setLanguage('zh')}
                    className={`px-3 py-1 text-xs font-medium border-r ${
                      language === 'zh'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-700 border-gray-200'
                    }`}
                  >
                    {t('langZh')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-xs font-medium ${
                      language === 'en'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-700 border-gray-200'
                    }`}
                  >
                    {t('langEn')}
                  </button>
                </div>
                {/* Theme toggle */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md bg-white/80 text-gray-700 shadow-sm border border-gray-200"
                >
                  <span>{t('themeLabel')}</span>
                  <span className="font-semibold">
                    {theme === 'light' ? t('themeLight') : t('themeDark')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        {stats && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">{t('totalUsers')}</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.overall.totalUsers}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">{t('totalConversations')}</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.overall.totalConversations}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {t('active')}: {stats.overall.activeConversations}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">{t('totalMessages')}</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.overall.totalMessages}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">{t('todayLlmStatus')}</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.today.llmCalls}</p>
                <p
                  className={`mt-1 text-sm ${
                    stats.today.llmErrors > 0 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {t('llmErrors')}: {stats.today.llmErrors}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {t('llmSuccessRate')}:{' '}
                  {stats.today.llmCalls === 0
                    ? '—'
                    : `${Math.round(
                        ((stats.today.llmCalls - stats.today.llmErrors) / stats.today.llmCalls) *
                          100
                      )}%`}
                </p>
              </div>
            </div>

            {/* Today stats */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-2">{t('todayStatsTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-xs text-gray-500">{t('todayUsers')}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stats.today.totalUsers}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-xs text-gray-500">{t('todayConversations')}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stats.today.totalConversations}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-xs text-gray-500">{t('todayMessages')}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stats.today.totalMessages}
                  </p>
                </div>
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
                    placeholder={t('searchPlaceholder')}
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
                    <option value="">{t('statusAll')}</option>
                    <option value="active">{t('statusActive')}</option>
                    <option value="ended">{t('statusEnded')}</option>
                  </select>
                </div>
              </div>
              {stats && (
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 gap-1">
                  <div>
                    {t('filterSummaryPrefix')} {filteredTotal} {t('filterSummarySuffix')}
                  </div>
                  {lastUpdated && (
                    <div>
                      {t('lastUpdated')}: {formatDate(lastUpdated)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Conversations List */}
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center text-gray-500">{t('loading')}</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">{t('noConversations')}</div>
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
                            {conversation.status === 'active' ? t('active') : t('ended')}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {t('messagesCount')}: {conversation.messages.length} | {t('createdAt')}:{' '}
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
                  <h2 className="text-xl font-bold text-gray-900">{t('conversationDetail')}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedConversation.lineUserId} |{' '}
                    {formatDate(selectedConversation.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedConversation.status === 'active' && (
                    <button
                      onClick={() => endConversation(selectedConversation._id)}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      {t('endConversation')}
                    </button>
                  )}
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
                        {message.role === 'user' ? t('user') : t('assistant')}
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

