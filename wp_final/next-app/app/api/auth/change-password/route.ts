import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6)
});

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  let userId: number;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    userId = payload.userId;
  } catch {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const parsed = changePasswordSchema.safeParse(json);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join(', ');
      return NextResponse.json({ message }, { status: 422 });
    }

    const { oldPassword, newPassword } = parsed.data;
    const user = db.findUserById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const ok = bcrypt.compareSync(oldPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: 'Old password is incorrect' }, { status: 401 });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.updateUserPassword(user.id, newHash);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
}


