import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function signToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join(', ');
      return NextResponse.json({ message }, { status: 422 });
    }

    const { studentId, password } = parsed.data;
    const user = db.findUserByStudentId(studentId);
    if (!user) {
      return NextResponse.json({ message: 'Invalid ID or password' }, { status: 401 });
    }

    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: 'Invalid ID or password' }, { status: 401 });
    }

    const token = signToken(user.id);
    const res = NextResponse.json(
      { id: user.id, studentId: user.studentId, name: user.name },
      { status: 200 }
    );
    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
}


