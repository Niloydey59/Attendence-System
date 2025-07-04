export interface StudentProfile {
  id: number;
  username: string;
  email: string;
  roll_number: string;
  department: string;
  semester: number;
  batch: string;
}

export interface StudentProfileUpdateRequest {
  roll_number?: string;
  department?: string;
  semester?: number;
  batch?: string;
}

export interface StudentProfileResponse {
  message: string;
  data: StudentProfile;
}

export interface StudentFaceImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  uploaded_at: string;
}

export interface StudentFaceImageUploadRequest {
  image: File;
  is_primary?: boolean;
}

export interface StudentFaceImageUploadResponse {
  message: string;
  data: StudentFaceImage;
}

export interface StudentFaceImageListResponse {
  count: number;
  images: StudentFaceImage[];
}

export interface StudentFaceImageUpdateRequest {
  is_primary?: boolean;
}

export interface StudentFaceImageUpdateResponse {
  message: string;
  data: StudentFaceImage;
}

export interface StudentFaceImageDeleteResponse {
  message: string;
}

// Add new interfaces for class and enrollment
export interface Class {
  id: number;
  course_id: string;
  course_name: string;
  teacher_name: string;
  batch: string;
  semester: number;
  schedule?: string;
  room_number?: string;
  created_at: string;
}

export interface AvailableClassesResponse {
  available_classes: Class[];
}

export interface EnrolledClassesResponse {
  enrolled_classes: Class[];
}

export interface ClassEnrollmentRequest {
  class_id: number;
}

export interface ClassEnrollmentResponse {
  message: string;
  enrollment_id: number;
}
