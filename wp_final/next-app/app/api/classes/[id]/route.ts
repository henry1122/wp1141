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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ message: 'Invalid class id' }, { status: 400 });
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

    const updated = db.updateClass(userId, id, parsed.data);
    if (!updated) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ message: 'Invalid class id' }, { status: 400 });
  }

  const ok = db.deleteClass(userId, id);
  if (!ok) {
    return NextResponse.json({ message: 'Class not found' }, { status: 404 });
  }
  return NextResponse.json({}, { status: 204 });
}


