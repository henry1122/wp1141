import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const QUIZ_DIR = join(process.cwd(), '..', 'week6_test');

type QuizScoreItem = {
  date: string;
  subject: string;
  title: string;
  score: number;
  total: number;
  file: string;
  seatNo?: string;
};

type SubjectSummary = {
  subject: string;
  count: number;
  average: number;
};

function detectSubject(name: string): string {
  if (name.includes('數學')) return '數學';
  if (name.includes('英文')) return '英文';
  if (name.includes('國文')) return '國文';
  if (name.includes('物理')) return '物理';
  if (name.includes('化學')) return '化學';
  if (name.includes('地科')) return '地科';
  if (name.includes('生物')) return '生物';
  return '其他';
}

function parseDateFromFilename(name: string): string {
  // 例如：0929數學小考16.csv → 09-29
  const m = name.match(/^(\d{4})/);
  if (!m) return '';
  const mm = m[1].slice(0, 2);
  const dd = m[1].slice(2, 4);
  return `${mm}-${dd}`;
}

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

  if (!existsSync(QUIZ_DIR)) {
    return NextResponse.json(
      {
        scores: [] as QuizScoreItem[],
        summary: {
          overallAverage: 0,
          subjectSummaries: [] as SubjectSummary[]
        },
        message:
          '找不到 week6_test 資料夾。請把小考成績 CSV 放在專案根目錄的 week6_test 下面。'
      },
      { status: 200 }
    );
  }

  const files = readdirSync(QUIZ_DIR).filter((f) => f.toLowerCase().endsWith('.csv'));
  if (files.length === 0) {
    return NextResponse.json(
      {
        scores: [] as QuizScoreItem[],
        summary: {
          overallAverage: 0,
          subjectSummaries: [] as SubjectSummary[]
        },
        message: 'week6_test 目前沒有任何 CSV 檔案。'
      },
      { status: 200 }
    );
  }

  const scores: QuizScoreItem[] = [];

  for (const file of files) {
    const fullPath = join(QUIZ_DIR, file);

    // 這些 CSV 原本是 Big5，為了確保數字與逗號不壞掉，這裡用 binary 讀取
    const raw = readFileSync(fullPath, 'binary');
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length <= 1) continue;

    const filenameWithoutExt = file.replace(/\.csv$/i, '');
    const subject = detectSubject(filenameWithoutExt);
    const date = parseDateFromFilename(filenameWithoutExt);
    const title = filenameWithoutExt;

    // 依標題列決定成績欄位：
    // - 簡單小考：座號,學號,姓名,小考成績   → 第 4 欄 (index 3)
    // - 複雜考試：後面有多個欄位（筆試、聽力、總分、加權） → 取最後一欄當最終成績
    const headerCols = lines[0].split(',');
    const scoreIndex = headerCols.length > 4 ? headerCols.length - 1 : 3;

    // 從第二列開始找符合該學生的成績
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      if (cols.length <= scoreIndex) continue;

      const seatNo = (cols[0] || '').trim();
      const studentIdInFile = (cols[1] || '').trim();
      const scoreRaw = (cols[scoreIndex] || '').trim();
      const score = Number(scoreRaw);

      if (!studentIdInFile || isNaN(score)) continue;
      if (studentIdInFile !== user.studentId) continue;

      scores.push({
        date,
        subject,
        title,
        score,
        total: 100,
        file,
        seatNo
      });
    }
  }

  if (scores.length === 0) {
    return NextResponse.json(
      {
        scores,
        summary: {
          overallAverage: 0,
          subjectSummaries: [] as SubjectSummary[]
        },
        message:
          '在 week6_test 的 CSV 裡找不到這個學號的成績，請確認學號是否一致（CSV 第二欄）。'
      },
      { status: 200 }
    );
  }

  // 依時間排序（檔名的日期）與科目
  scores.sort((a, b) => {
    if (a.date === b.date) {
      if (a.subject === b.subject) return a.title.localeCompare(b.title);
      return a.subject.localeCompare(b.subject);
    }
    return a.date.localeCompare(b.date);
  });

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const totalFull = scores.reduce((sum, s) => sum + s.total, 0);
  const overallAverage =
    totalFull > 0 ? Math.round((totalScore / totalFull) * 100) : 0;

  const subjectMap = new Map<string, { sum: number; full: number; count: number }>();
  for (const s of scores) {
    const entry = subjectMap.get(s.subject) || { sum: 0, full: 0, count: 0 };
    entry.sum += s.score;
    entry.full += s.total;
    entry.count += 1;
    subjectMap.set(s.subject, entry);
  }

  const subjectSummaries: SubjectSummary[] = Array.from(subjectMap.entries()).map(
    ([subject, info]) => ({
      subject,
      count: info.count,
      average: info.full > 0 ? Math.round((info.sum / info.full) * 100) : 0
    })
  );

  return NextResponse.json(
    {
      scores,
      summary: {
        overallAverage,
        subjectSummaries
      }
    },
    { status: 200 }
  );
}


