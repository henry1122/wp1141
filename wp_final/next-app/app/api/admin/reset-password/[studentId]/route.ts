import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(
  _req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const studentId = params.studentId?.trim();
  if (!studentId) {
    return NextResponse.json({ message: 'studentId is required' }, { status: 400 });
  }

  const user = db.findUserByStudentId(studentId);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const hash = bcrypt.hashSync(studentId, 10);
  db.updateUserPassword(user.id, hash);

  return NextResponse.json(
    {
      message: 'Password reset to studentId',
      studentId,
      id: user.id
    },
    { status: 200 }
  );
}


