import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaExclamationTriangle, FaHome, FaSignInAlt } from 'react-icons/fa'

type ErrorType = 
  | 'Configuration'
  | 'AccessDenied'
  | 'Verification'
  | 'Default'

const errorMessages: Record<ErrorType, { title: string; message: string }> = {
  Configuration: {
    title: '配置错误',
    message: '服务器配置有问题。请检查环境变量是否正确设置。',
  },
  AccessDenied: {
    title: '访问被拒绝',
    message: '您没有权限访问此资源。',
  },
  Verification: {
    title: '验证失败',
    message: '验证令牌已过期或无效。',
  },
  Default: {
    title: '发生错误',
    message: '登录过程中发生了错误。请重试。',
  },
}

export default function AuthError() {
  const router = useRouter()
  const { error } = router.query
  const [errorType, setErrorType] = useState<ErrorType>('Default')

  useEffect(() => {
    if (error) {
      if (typeof error === 'string') {
        const errorKey = error as ErrorType
        if (errorMessages[errorKey]) {
          setErrorType(errorKey)
        }
      }
    }
  }, [error])

  const errorInfo = errorMessages[errorType]

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-3xl text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">{errorInfo.title}</h1>
          <p className="text-muted-foreground">{errorInfo.message}</p>
        </div>

        {error && (
          <div className="bg-secondary border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">错误代码：</p>
            <p className="text-sm font-mono text-foreground">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-full font-semibold hover:opacity-90 transition shadow-sm flex items-center justify-center space-x-2"
          >
            <FaSignInAlt />
            <span>返回登录</span>
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-secondary border border-border text-foreground py-3 px-4 rounded-full font-semibold hover:bg-secondary/80 transition flex items-center justify-center space-x-2"
          >
            <FaHome />
            <span>返回首页</span>
          </button>
        </div>

        {errorType === 'Configuration' && (
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-semibold mb-2">需要检查的配置：</p>
            <ul className="text-sm text-yellow-600/80 space-y-1 list-disc list-inside">
              <li>NEXTAUTH_URL 是否正确设置</li>
              <li>NEXTAUTH_SECRET 是否正确设置</li>
              <li>OAuth Provider 凭据是否正确</li>
              <li>DATABASE_URL 是否正确设置</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

