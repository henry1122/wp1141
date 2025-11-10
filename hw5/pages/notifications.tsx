import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { formatTimeAgo } from '@/lib/utils'
import { FaHeart, FaRetweet, FaComment, FaUserPlus } from 'react-icons/fa'

export default function Notifications() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session?.user?.userID) {
      router.push('/auth/signin')
      return
    }

    fetchNotifications()
  }, [session, status, router])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notificationId, read: true }),
      })
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ read: true }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-red-500" />
      case 'repost':
        return <FaRetweet className="text-green-500" />
      case 'comment':
        return <FaComment className="text-blue-500" />
      case 'follow':
        return <FaUserPlus className="text-primary" />
      default:
        return null
    }
  }

  const getNotificationText = (notification: any) => {
    const actorName = notification.actor?.name || 'Someone'
    switch (notification.type) {
      case 'like':
        return `${actorName} liked your post`
      case 'repost':
        return `${actorName} reposted your post`
      case 'comment':
        return `${actorName} commented on your post`
      case 'follow':
        return `${actorName} followed you`
      default:
        return 'New notification'
    }
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.postId) {
      router.push(`/post/${notification.postId}`)
    } else if (notification.type === 'follow') {
      router.push(`/profile/${notification.actor?.userID}`)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 border-x border-border ml-64">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-secondary/30 transition cursor-pointer ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <img
                        src={notification.actor?.image || '/default-avatar.png'}
                        alt={notification.actor?.name || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-foreground">
                          {getNotificationText(notification)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                        {notification.post && (
                          <div className="mt-2 p-3 bg-secondary rounded-lg border border-border">
                            <p className="text-sm text-foreground line-clamp-2">
                              {notification.post.content}
                            </p>
                            {notification.post.imageUrl && (
                              <img
                                src={notification.post.imageUrl}
                                alt="Post"
                                className="mt-2 rounded-lg max-w-xs"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

