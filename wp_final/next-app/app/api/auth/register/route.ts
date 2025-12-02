import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { registerSchema } from '@/lib/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function signToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join(', ');
      return NextResponse.json({ message }, { status: 422 });
    }

    const { studentId, password, name } = parsed.data;
    // 預設密碼 = 學號；如果有傳入自訂密碼就用自訂密碼
    const rawPassword = password ?? studentId;
    const passwordHash = bcrypt.hashSync(rawPassword, 10);

    try {
      const user = db.createUser(studentId, passwordHash, name);
      const token = signToken(user.id);

      const res = NextResponse.json(
        { id: user.id, studentId: user.studentId, name: user.name },
        { status: 201 }
      );
      res.cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/'
      });
      return res;
    } catch (e: any) {
      if (e instanceof Error && e.message === 'STUDENT_ID_EXISTS') {
        return NextResponse.json({ message: 'Student ID already registered' }, { status: 409 });
      }
      console.error(e);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
}


