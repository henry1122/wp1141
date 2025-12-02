export interface User {
  id: number;
  studentId: string;
  name?: string;
  passwordHash: string;
  createdAt: string;
}

export interface Student {
  id: number;
  userId: number;
  name: string;
  grade?: string;
  phone?: string;
  note?: string;
  createdAt: string;
}

export interface ClassItem {
  id: number;
  userId: number;
  title: string;
  teacher?: string;
  room?: string;
  weekday: number; // 1-7
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  createdAt: string;
}

export interface DatabaseFile {
  users: User[];
  students: Student[];
  classes: ClassItem[];
  nextIds: {
    user: number;
    student: number;
    class: number;
  };
}


