import { z } from 'zod'

export const userIDSchema = z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/)

