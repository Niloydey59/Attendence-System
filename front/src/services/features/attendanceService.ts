import apiClient from '../api/apiClient';
import { handleApiError } from '../api/apiUtils';
import {
  AttendanceSession,
  AttendanceSessionResponse,
  AttendanceSessionGetResponse,
  AttendanceRecordsResponse,
  FaceRecognitionRequest,
  FaceRecognitionResponse,
  EndSessionResponse
} from '@/src/types/attendance';

export const startAttendanceSession = async (classId: number): Promise<AttendanceSessionResponse> => {
  try {
    const response = await apiClient.post<AttendanceSessionResponse>(
      `/attendance/sessions/class/${classId}/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getTodayAttendanceSession = async (classId: number): Promise<AttendanceSessionGetResponse> => {
  try {
    const response = await apiClient.get<AttendanceSessionGetResponse>(
      `/attendance/sessions/class/${classId}/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const processFaceRecognition = async (
  sessionId: number, 
  imageData: FaceRecognitionRequest
): Promise<FaceRecognitionResponse> => {
  try {
    const response = await apiClient.post<FaceRecognitionResponse>(
      `/attendance/sessions/${sessionId}/recognize/`,
      imageData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getAttendanceRecords = async (sessionId: number): Promise<AttendanceRecordsResponse> => {
  try {
    const response = await apiClient.get<AttendanceRecordsResponse>(
      `/attendance/sessions/${sessionId}/records/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const endAttendanceSession = async (sessionId: number): Promise<EndSessionResponse> => {
  try {
    const response = await apiClient.patch<EndSessionResponse>(
      `/attendance/sessions/${sessionId}/end/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Helper function to convert image file to base64
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper function to convert canvas/webcam capture to base64
export const convertCanvasToBase64 = (canvas: HTMLCanvasElement): string => {
  const dataURL = canvas.toDataURL('image/jpeg', 0.8);
  // Remove data:image/...;base64, prefix
  return dataURL.split(',')[1];
};

// Helper function to process webcam image for attendance
export const processWebcamImage = async (
  sessionId: number,
  imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<FaceRecognitionResponse> => {
  try {
    let base64Image: string;
    
    if (imageElement instanceof HTMLCanvasElement) {
      base64Image = convertCanvasToBase64(imageElement);
    } else {
      // Convert image or video to canvas first
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      canvas.width = imageElement instanceof HTMLVideoElement ? imageElement.videoWidth : imageElement.width;
      canvas.height = imageElement instanceof HTMLVideoElement ? imageElement.videoHeight : imageElement.height;
      
      ctx.drawImage(imageElement, 0, 0);
      base64Image = convertCanvasToBase64(canvas);
    }
    
    return await processFaceRecognition(sessionId, { image_data: base64Image });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
