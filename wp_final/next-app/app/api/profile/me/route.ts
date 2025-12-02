import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const CSV_PATH = join(process.cwd(), '..', '學生資料.csv');

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  let userId: number;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    userId = payload.userId;
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const user = db.findUserById(userId);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  if (!existsSync(CSV_PATH)) {
    return NextResponse.json(
      { message: '學生資料.csv 不存在，無法載入個人資料。' },
      { status: 500 }
    );
  }

  const raw = readFileSync(CSV_PATH, 'utf-8');
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) {
    return NextResponse.json(
      { message: '學生資料.csv 沒有任何學生資料。' },
      { status: 500 }
    );
  }

  const dataLines =
    /學號|student/i.test(lines[0]) || /姓名|name/i.test(lines[0])
      ? lines.slice(1)
      : lines;

  const row = dataLines
    .map((line) => line.split(','))
    .find((cols) => (cols[0] || '').trim() === user.studentId);

  if (!row) {
    // 找不到就至少回傳基本資訊
    return NextResponse.json(
      {
        studentId: user.studentId,
        name: user.name || ''
      },
      { status: 200 }
    );
  }

  const [
    studentId,
    name,
    juniorHigh,
    seniorHigh,
    className,
    seatNo,
    phone1,
    fatherPhone,
    motherPhone,
    studentPhone,
    notifySms,
    enrollDate,
    quitDate
  ] = row.map((v) => v.trim());

  return NextResponse.json(
    {
      studentId,
      name,
      juniorHigh,
      seniorHigh,
      className,
      seatNo,
      phone1,
      fatherPhone,
      motherPhone,
      studentPhone,
      notifySms,
      enrollDate,
      quitDate
    },
    { status: 200 }
  );
}


