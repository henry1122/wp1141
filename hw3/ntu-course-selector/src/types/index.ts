export interface Course {
  course_id: string;
  course_name: string;
  department: string;
  credits: number;
  time_slot: string;
  classroom: string;
  instructor: string;
  description: string;
  prerequisites: string;
  max_students: number;
  current_enrollment: number;
  tno: number;  // 添加tno欄位
}

export interface Department {
  department_id: string;
  department_name: string;
  college: string;
  description: string;
}

export interface SelectedCourse extends Course {
  selected: boolean;
}

export interface CourseSelection {
  course: Course;
  timestamp: Date;
}

export interface SubmittedRecord {
  id: string;
  courses: Course[];
  submittedAt: Date;
  status: 'submitted' | 'confirmed';
}
