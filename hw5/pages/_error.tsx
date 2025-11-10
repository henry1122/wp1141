import { NextPageContext } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home if 404
    if (statusCode === 404) {
      router.push('/')
    }
  }, [statusCode, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          {statusCode ? `Error ${statusCode}` : 'An error occurred'}
        </h1>
        <p className="text-muted-foreground mb-4">
          {statusCode === 404
            ? 'This page could not be found.'
            : 'Something went wrong.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold hover:opacity-90 transition shadow-sm"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : (err as any)?.statusCode || 404
  return { statusCode }
}

export default Error

