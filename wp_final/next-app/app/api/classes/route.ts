import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { classSchema } from '@/lib/validation';

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
  const rows = db.listClasses(userId);
  return NextResponse.json(rows, { status: 200 });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const parsed = classSchema.safeParse(json);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join(', ');
      return NextResponse.json({ message }, { status: 422 });
    }

    const created = db.createClass(userId, parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
}


