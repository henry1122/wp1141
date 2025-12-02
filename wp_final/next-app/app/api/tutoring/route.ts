import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { tutoringStore } from '@/lib/tutoringStore';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function getUserId(req: NextRequest): number | null {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }
  const slots = tutoringStore.getAll();
  return NextResponse.json(slots, { status: 200 });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const weekday = Number(json.weekday);
    const time = String(json.time || '').trim();
    if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7 || !time) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const user = db.findUserById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const res = tutoringStore.reserve(
      userId,
      user.studentId,
      user.name,
      weekday,
      time
    );
    if (res === 'TAKEN') {
      return NextResponse.json(
        { message: 'Slot already reserved by another student' },
        { status: 409 }
      );
    }
    return NextResponse.json(res, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const weekday = Number(json.weekday);
    const time = String(json.time || '').trim();
    if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7 || !time) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const ok = tutoringStore.cancel(userId, weekday, time);
    if (!ok) {
      return NextResponse.json({ message: 'No reservation to cancel' }, { status: 404 });
    }
    return NextResponse.json({}, { status: 204 });
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
}


