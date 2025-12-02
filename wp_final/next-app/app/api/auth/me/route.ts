import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = db.findUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(
      {
        id: user.id,
        studentId: user.studentId,
        name: user.name,
        createdAt: user.createdAt
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}


