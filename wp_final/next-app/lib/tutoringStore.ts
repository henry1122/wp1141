import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const TUTORING_PATH = join(DATA_DIR, 'tutoring.json');

export interface TutoringSlot {
  id: number;
  weekday: number; // 1-7
  time: string; // 'HH:MM'
  userId: number;
  studentId: string;
  studentName?: string;
}

interface TutoringFile {
  slots: TutoringSlot[];
  nextId: number;
}

function ensureFile(): TutoringFile {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(TUTORING_PATH)) {
    const initial: TutoringFile = { slots: [], nextId: 1 };
    writeFileSync(TUTORING_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  const raw = readFileSync(TUTORING_PATH, 'utf-8');
  return JSON.parse(raw) as TutoringFile;
}

function saveFile(data: TutoringFile) {
  writeFileSync(TUTORING_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export const tutoringStore = {
  getAll(): TutoringSlot[] {
    return ensureFile().slots;
  },

  reserve(
    userId: number,
    studentId: string,
    studentName: string | undefined,
    weekday: number,
    time: string
  ): TutoringSlot | 'TAKEN' {
    const data = ensureFile();
    const existing = data.slots.find(
      (s) => s.weekday === weekday && s.time === time
    );
    if (existing) {
      if (existing.userId === userId) {
        return existing;
      }
      return 'TAKEN';
    }

    const slot: TutoringSlot = {
      id: data.nextId++,
      weekday,
      time,
      userId,
      studentId,
      studentName
    };
    data.slots.push(slot);
    saveFile(data);
    return slot;
  },

  cancel(userId: number, weekday: number, time: string): boolean {
    const data = ensureFile();
    const before = data.slots.length;
    data.slots = data.slots.filter(
      (s) => !(s.weekday === weekday && s.time === time && s.userId === userId)
    );
    const changed = data.slots.length !== before;
    if (changed) saveFile(data);
    return changed;
  }
};


