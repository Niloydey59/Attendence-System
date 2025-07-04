import apiClient from '../api/apiClient';
import { handleApiError } from '../api/apiUtils';
import {
  StudentProfile,
  StudentProfileUpdateRequest,
  StudentProfileResponse,
  StudentFaceImageUploadRequest,
  StudentFaceImageUploadResponse,
  StudentFaceImageListResponse,
  StudentFaceImageUpdateRequest,
  StudentFaceImageUpdateResponse,
  StudentFaceImageDeleteResponse,
  // Add new type imports
  AvailableClassesResponse,
  EnrolledClassesResponse,
  ClassEnrollmentRequest,
  ClassEnrollmentResponse
} from '@/src/types/student';

export const uploadFaceImage = async (imageData: StudentFaceImageUploadRequest): Promise<StudentFaceImageUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', imageData.image);
    
    if (imageData.is_primary !== undefined) {
      formData.append('is_primary', imageData.is_primary.toString());
    }

    const response = await apiClient.post<StudentFaceImageUploadResponse>(
      '/students/face-images/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getFaceImages = async (): Promise<StudentFaceImageListResponse> => {
  try {
    const response = await apiClient.get<StudentFaceImageListResponse>('/students/face-images/');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateFaceImage = async (
  imageId: number, 
  updateData: StudentFaceImageUpdateRequest
): Promise<StudentFaceImageUpdateResponse> => {
  try {
    const response = await apiClient.patch<StudentFaceImageUpdateResponse>(
      `/students/face-images/${imageId}/`,
      updateData
    );
    
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteFaceImage = async (imageId: number): Promise<StudentFaceImageDeleteResponse> => {
  try {
    const response = await apiClient.delete<StudentFaceImageDeleteResponse>(
      `/students/face-images/${imageId}/`
    );
    
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const setPrimaryImage = async (imageId: number): Promise<StudentFaceImageUpdateResponse> => {
  try {
    return await updateFaceImage(imageId, { is_primary: true });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getStudentProfile = async (): Promise<StudentProfileResponse> => {
  try {
    const response = await apiClient.get<StudentProfileResponse>('/students/profile/');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateStudentProfile = async (profileData: StudentProfileUpdateRequest): Promise<StudentProfileResponse> => {
  try {
    const response = await apiClient.put<StudentProfileResponse>('/students/profile/', profileData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const partialUpdateStudentProfile = async (profileData: StudentProfileUpdateRequest): Promise<StudentProfileResponse> => {
  try {
    const response = await apiClient.patch<StudentProfileResponse>('/students/profile/', profileData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// New functions for class enrollment

/**
 * Get list of available classes that the student can enroll in
 */
export const getAvailableClasses = async (): Promise<AvailableClassesResponse> => {
  try {
    const response = await apiClient.get<AvailableClassesResponse>('/students/classes/');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get list of classes the student is already enrolled in
 */
export const getEnrolledClasses = async (): Promise<EnrolledClassesResponse> => {
  try {
    const response = await apiClient.get<EnrolledClassesResponse>('/students/enrollments/');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Enroll student in a new class
 */
export const enrollInClass = async (classId: number): Promise<ClassEnrollmentResponse> => {
  try {
    const enrollmentData: ClassEnrollmentRequest = {
      class_id: classId
    };
    
    const response = await apiClient.post<ClassEnrollmentResponse>(
      '/students/enrollments/',
      enrollmentData
    );
    
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
