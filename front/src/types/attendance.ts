export interface AttendanceSession {
  id: number;
  class_instance: number;
  class_name: string;
  course_code: string;
  section: string;
  date: string;
  is_active: boolean;
  total_enrolled: number;
  total_present: number;
  total_absent: number;
  created_at: string;
}

export interface AttendanceSessionResponse {
  message: string;
  session: AttendanceSession;
}

export interface AttendanceSessionGetResponse {
  session: AttendanceSession;
}

export interface AttendanceRecord {
  id: number;
  student_name: string;
  student_roll: string;
  status: 'PRESENT' | 'ABSENT';
  marked_at: string;
  confidence_score: number | null;
}

export interface AttendanceRecordsResponse {
  session: AttendanceSession;
  records: AttendanceRecord[];
}

export interface FaceRecognitionRequest {
  image_data: string; // Base64 encoded image
}

export interface RecognizedStudent {
  student_id: number;
  student_name: string;
  roll_number: string;
  confidence: number;
}

export interface FaceRecognitionResponse {
  message: string;
  recognized_students: RecognizedStudent[];
}

export interface EndSessionResponse {
  message: string;
  session: AttendanceSession;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT';
