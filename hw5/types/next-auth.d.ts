import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      userID: string
      name?: string | null
      email?: string | null
      image?: string | null
      bio?: string | null
      coverImage?: string | null
      postsCount?: number
      followingCount?: number
      followersCount?: number
      provider?: string
    }
  }

  interface User {
    userID?: string
    bio?: string | null
    coverImage?: string | null
    provider?: string
  }
}


