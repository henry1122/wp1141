import { NextRequest, NextResponse } from 'next/server';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';

const SRC_PATH = join(process.cwd(), '..', '課表.jpg');
const PUBLIC_DIR = join(process.cwd(), 'public');
const DEST_PATH = join(PUBLIC_DIR, 'timetable.jpg');

export async function POST(_req: NextRequest) {
  if (!existsSync(SRC_PATH)) {
    return NextResponse.json(
      {
        message:
          '找不到課表.jpg。請先把「課表.jpg」放在專案根目錄（與 next-app 同一層）。'
      },
      { status: 404 }
    );
  }

  if (!existsSync(PUBLIC_DIR)) {
    mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  copyFileSync(SRC_PATH, DEST_PATH);

  return NextResponse.json(
    {
      message: '課表圖片已更新，學生端課表頁面會顯示最新的 timetable.jpg。'
    },
    { status: 200 }
  );
}





