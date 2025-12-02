import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

// 會讀取專案根目錄的「學生資料.csv」：
// C:\Users\User\Desktop\wp_final\學生資料.csv
const CSV_PATH = join(process.cwd(), '..', '學生資料.csv');

export async function GET(_req: NextRequest) {
  if (!existsSync(CSV_PATH)) {
    return NextResponse.json(
      {
        message:
          '找不到 CSV 檔案。請先在專案根目錄建立「學生資料.csv」，第一欄為學號，第二欄為姓名（可有標題列）。'
      },
      { status: 404 }
    );
  }

  const raw = readFileSync(CSV_PATH, 'utf-8');
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return NextResponse.json({ message: 'CSV 內容是空的。' }, { status: 400 });
  }

  // 如果第一列看起來像標題，就略過
  const dataLines =
    /學號|student/i.test(lines[0]) || /姓名|name/i.test(lines[0])
      ? lines.slice(1)
      : lines;

  let imported = 0;
  let skipped = 0;

  for (const line of dataLines) {
    const parts = line.split(',');
    if (parts.length === 0) continue;

    const studentId = (parts[0] || '').trim();
    if (!studentId) continue;

    const name = (parts[1] || '').trim();
    const grade = (parts[2] || '').trim();
    const phone = (parts[3] || '').trim();
    const note = (parts[4] || '').trim();

    const existing = db.findUserByStudentId(studentId);
    if (existing) {
      skipped += 1;
      continue;
    }

    const passwordHash = bcrypt.hashSync(studentId, 10); // 預設密碼 = 學號
    const user = db.createUser(studentId, passwordHash, name || undefined);
    db.createStudent(user.id, {
      name: name || studentId,
      grade: grade || undefined,
      phone: phone || undefined,
      note: note || undefined
    });

    imported += 1;
  }

  return NextResponse.json(
    {
      message: '匯入完成。',
      imported,
      skippedExisting: skipped
    },
    { status: 200 }
  );
}


