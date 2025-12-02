import { z } from 'zod';

export const registerSchema = z.object({
  studentId: z.string().min(1),
  // 可選自訂密碼；若沒提供就預設用 studentId 當初始密碼
  password: z.string().min(6).optional(),
  name: z.string().min(1).optional()
});

export const loginSchema = z.object({
  studentId: z.string().min(1),
  password: z.string().min(6)
});

export const studentSchema = z.object({
  name: z.string().min(1),
  grade: z.string().optional(),
  phone: z.string().optional(),
  note: z.string().optional()
});

export const classSchema = z.object({
  title: z.string().min(1),
  teacher: z.string().optional(),
  room: z.string().optional(),
  weekday: z.number().int().min(1).max(7),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/)
});


