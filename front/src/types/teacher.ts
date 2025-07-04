export interface TeacherProfile {
  id: number;
  username: string;
  email: string;
  employee_id: string;
  department: string;
  designation: string;
}

export interface TeacherProfileUpdateRequest {
  employee_id?: string;
  department?: string;
  designation?: string;
}

export interface TeacherProfileResponse {
  message: string;
  data: TeacherProfile;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
}

export interface CourseCreateRequest {
  code: string;
  name: string;
  semester: number;
  credits: number;
}

export interface CourseCreateResponse {
  message: string;
  data: Course;
}

export interface CourseListResponse {
  courses: Course[];
}

export interface Class {
  id: number;
  course: Course;
  course_id?: number;
  section: string;
  batch: string;
  semester: number;
  academic_year: string;
  enrolled_count: number;
  teacher_name: string;
  created_at: string;
}

export interface ClassCreateRequest {
  course_id: number;
  section: string;
  batch: string;
  semester: number;
  academic_year: string;
}

export interface ClassListResponse {
  classes: Class[];
}

export interface ClassDetailResponse {
  class: Class;
}

export interface ClassCreateResponse {
  message: string;
  data: Class;
}

export interface ClassEnrollment {
  id: number;
  student_name: string;
  student_roll: string;
  class_name: string;
  enrolled_at: string;
  is_active: boolean;
}

export interface ClassEnrollmentListResponse {
  enrollments: ClassEnrollment[];
  total_enrolled: number;
}
