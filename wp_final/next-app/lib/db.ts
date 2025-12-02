import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ClassItem, DatabaseFile, Student, User } from './types';

const DATA_DIR = join(process.cwd(), 'data');
const DB_PATH = join(DATA_DIR, 'db.json');

function ensureDbFile(): DatabaseFile {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DB_PATH)) {
    const initial: DatabaseFile = {
      users: [],
      students: [],
      classes: [],
      nextIds: { user: 1, student: 1, class: 1 }
    };
    writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  const raw = readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw) as DatabaseFile;
}

function saveDb(db: DatabaseFile) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export const db = {
  getAll(): DatabaseFile {
    return ensureDbFile();
  },

  createUser(studentId: string, passwordHash: string, name?: string): User {
    const current = ensureDbFile();
    if (current.users.some((u) => u.studentId === studentId)) {
      throw new Error('STUDENT_ID_EXISTS');
    }
    const id = current.nextIds.user++;
    const user: User = {
      id,
      studentId,
      name,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    current.users.push(user);
    saveDb(current);
    return user;
  },

  findUserByStudentId(studentId: string): User | undefined {
    const current = ensureDbFile();
    return current.users.find((u) => u.studentId === studentId);
  },

  findUserById(id: number): User | undefined {
    const current = ensureDbFile();
    return current.users.find((u) => u.id === id);
  },

  updateUserPassword(id: number, passwordHash: string): User | undefined {
    const current = ensureDbFile();
    const idx = current.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    current.users[idx].passwordHash = passwordHash;
    saveDb(current);
    return current.users[idx];
  },

  listStudents(userId: number): Student[] {
    const current = ensureDbFile();
    return current.students
      .filter((s) => s.userId === userId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  createStudent(
    userId: number,
    payload: Omit<Student, 'id' | 'userId' | 'createdAt'>
  ): Student {
    const current = ensureDbFile();
    const id = current.nextIds.student++;
    const student: Student = {
      id,
      userId,
      name: payload.name,
      grade: payload.grade,
      phone: payload.phone,
      note: payload.note,
      createdAt: new Date().toISOString()
    };
    current.students.push(student);
    saveDb(current);
    return student;
  },

  updateStudent(
    userId: number,
    id: number,
    payload: Omit<Student, 'id' | 'userId' | 'createdAt'>
  ): Student | undefined {
    const current = ensureDbFile();
    const idx = current.students.findIndex(
      (s) => s.id === id && s.userId === userId
    );
    if (idx === -1) return undefined;
    const existing = current.students[idx];
    const updated: Student = {
      ...existing,
      name: payload.name,
      grade: payload.grade,
      phone: payload.phone,
      note: payload.note
    };
    current.students[idx] = updated;
    saveDb(current);
    return updated;
  },

  deleteStudent(userId: number, id: number): boolean {
    const current = ensureDbFile();
    const before = current.students.length;
    current.students = current.students.filter(
      (s) => !(s.id === id && s.userId === userId)
    );
    const changed = current.students.length !== before;
    if (changed) saveDb(current);
    return changed;
  },

  listClasses(userId: number): ClassItem[] {
    const current = ensureDbFile();
    return current.classes
      .filter((c) => c.userId === userId)
      .sort((a, b) =>
        a.weekday === b.weekday
          ? a.startTime.localeCompare(b.startTime)
          : a.weekday - b.weekday
      );
  },

  createClass(
    userId: number,
    payload: Omit<ClassItem, 'id' | 'userId' | 'createdAt'>
  ): ClassItem {
    const current = ensureDbFile();
    const id = current.nextIds.class++;
    const item: ClassItem = {
      id,
      userId,
      title: payload.title,
      teacher: payload.teacher,
      room: payload.room,
      weekday: payload.weekday,
      startTime: payload.startTime,
      endTime: payload.endTime,
      createdAt: new Date().toISOString()
    };
    current.classes.push(item);
    saveDb(current);
    return item;
  },

  updateClass(
    userId: number,
    id: number,
    payload: Omit<ClassItem, 'id' | 'userId' | 'createdAt'>
  ): ClassItem | undefined {
    const current = ensureDbFile();
    const idx = current.classes.findIndex(
      (c) => c.id === id && c.userId === userId
    );
    if (idx === -1) return undefined;
    const existing = current.classes[idx];
    const updated: ClassItem = {
      ...existing,
      title: payload.title,
      teacher: payload.teacher,
      room: payload.room,
      weekday: payload.weekday,
      startTime: payload.startTime,
      endTime: payload.endTime
    };
    current.classes[idx] = updated;
    saveDb(current);
    return updated;
  },

  deleteClass(userId: number, id: number): boolean {
    const current = ensureDbFile();
    const before = current.classes.length;
    current.classes = current.classes.filter(
      (c) => !(c.id === id && c.userId === userId)
    );
    const changed = current.classes.length !== before;
    if (changed) saveDb(current);
    return changed;
  }
};


