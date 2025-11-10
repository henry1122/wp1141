import { prisma } from './prisma'

export async function createNotification(
  userId: string,
  type: 'like' | 'repost' | 'comment' | 'follow',
  actorId: string,
  postId?: string
) {
  try {
    // Don't create notification if user is acting on their own content
    if (userId === actorId) {
      return null
    }

    // Check if notification already exists (prevent duplicates)
    const existing = await prisma.notification.findFirst({
      where: {
        userId,
        type,
        actorId,
        postId: postId || null,
        read: false,
      },
    })

    if (existing) {
      return existing
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        actorId,
        postId: postId || null,
      },
    })

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

