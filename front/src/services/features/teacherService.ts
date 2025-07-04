import apiClient from '../api/apiClient';
import { handleApiError } from '../api/apiUtils';
import {
  TeacherProfile,
  TeacherProfileUpdateRequest,
  TeacherProfileResponse,
  Course,
  CourseCreateRequest,
  CourseCreateResponse,
  CourseListResponse,
  ClassCreateRequest,
  ClassListResponse,
  ClassDetailResponse,
  ClassCreateResponse,
  ClassEnrollmentListResponse
} from '@/src/types/teacher';

export const getTeacherProfile = async (): Promise<TeacherProfileResponse> => {
  try {
    const response = await apiClient.get<TeacherProfileResponse>('/teachers/profile/');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const updateTeacherProfile = async (profileData: TeacherProfileUpdateRequest): Promise<TeacherProfileResponse> => {
  try {
    const response = await apiClient.put<TeacherProfileResponse>('/teachers/profile/', profileData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const partialUpdateTeacherProfile = async (profileData: TeacherProfileUpdateRequest): Promise<TeacherProfileResponse> => {
  try {
    const response = await apiClient.patch<TeacherProfileResponse>('/teachers/profile/', profileData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getCourses = async (): Promise<CourseListResponse> => {
  try {
    const response = await apiClient.get<CourseListResponse>('/teachers/courses/');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const createCourse = async (courseData: CourseCreateRequest): Promise<CourseCreateResponse> => {
  try {
    const response = await apiClient.post<CourseCreateResponse>('/teachers/courses/', courseData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getTeacherClasses = async (): Promise<ClassListResponse> => {
  try {
    const response = await apiClient.get<ClassListResponse>('/teachers/classes/');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const createClass = async (classData: ClassCreateRequest): Promise<ClassCreateResponse> => {
  try {
    const response = await apiClient.post<ClassCreateResponse>('/teachers/classes/', classData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getClassDetail = async (classId: number): Promise<ClassDetailResponse> => {
  try {
    const response = await apiClient.get<ClassDetailResponse>(`/teachers/classes/${classId}/`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getClassEnrollments = async (classId: number): Promise<ClassEnrollmentListResponse> => {
  try {
    const response = await apiClient.get<ClassEnrollmentListResponse>(`/teachers/classes/${classId}/enrollments/`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
