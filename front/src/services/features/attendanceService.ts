import apiClient from '../api/apiClient';
import { handleApiError } from '../api/apiUtils';
import {
  AttendanceSession,
  AttendanceSessionResponse,
  AttendanceSessionGetResponse,
  AttendanceRecordsResponse,
  FaceRecognitionRequest,
  FaceRecognitionResponse,
  EndSessionResponse,
  DeleteSessionResponse,
  DeleteAllSessionsResponse,
  DeleteRecordResponse,
  GetAllSessionsResponse
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
    console.log("🔍 Making face recognition API call...");
    console.log("Session ID:", sessionId);
    console.log("Image data length:", imageData.image_data.length);
    console.log("API endpoint:", `/attendance/sessions/${sessionId}/recognize/`);
    
    const response = await apiClient.post<FaceRecognitionResponse>(
      `/attendance/sessions/${sessionId}/recognize/`,
      imageData
    );
    
    console.log("✅ Face recognition API response received:");
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    console.log("Data:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("❌ Face recognition API error:");
    console.error("Error object:", error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error("Response status:", axiosError.response?.status);
      console.error("Response data:", axiosError.response?.data);
      console.error("Response headers:", axiosError.response?.headers);
    }
    
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

export const getAllAttendanceSessions = async (classId: number): Promise<GetAllSessionsResponse> => {
  try {
    const response = await apiClient.get<GetAllSessionsResponse>(
      `/attendance/sessions/class/${classId}/all/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteAttendanceSession = async (sessionId: number): Promise<DeleteSessionResponse> => {
  try {
    const response = await apiClient.delete<DeleteSessionResponse>(
      `/attendance/sessions/${sessionId}/delete/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteAllAttendanceSessions = async (classId: number): Promise<DeleteAllSessionsResponse> => {
  try {
    const response = await apiClient.delete<DeleteAllSessionsResponse>(
      `/attendance/sessions/class/${classId}/delete-all/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleteAttendanceRecord = async (recordId: number): Promise<DeleteRecordResponse> => {
  try {
    const response = await apiClient.delete<DeleteRecordResponse>(
      `/attendance/records/${recordId}/delete/`
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
    console.log("🖼️ Processing webcam image for face recognition...");
    console.log("Session ID:", sessionId);
    console.log("Image element type:", imageElement.constructor.name);
    
    let base64Image: string;
    
    if (imageElement instanceof HTMLCanvasElement) {
      console.log("📸 Converting canvas to base64...");
      console.log("Canvas size:", imageElement.width, "x", imageElement.height);
      base64Image = convertCanvasToBase64(imageElement);
    } else {
      console.log("🔄 Converting image/video to canvas first...");
      // Convert image or video to canvas first
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      canvas.width = imageElement instanceof HTMLVideoElement ? imageElement.videoWidth : imageElement.width;
      canvas.height = imageElement instanceof HTMLVideoElement ? imageElement.videoHeight : imageElement.height;
      
      console.log("Canvas dimensions:", canvas.width, "x", canvas.height);
      
      ctx.drawImage(imageElement, 0, 0);
      base64Image = convertCanvasToBase64(canvas);
    }
    
    console.log("📤 Base64 image prepared, length:", base64Image.length);
    console.log("🚀 Sending to face recognition API...");
    
    const result = await processFaceRecognition(sessionId, { image_data: base64Image });
    
    console.log("✅ Face recognition completed successfully");
    console.log("📡 API Response Message:", result.message);
    
    return result;
    
  } catch (error) {
    console.error("❌ Error in processWebcamImage:");
    console.error(error);
    handleApiError(error);
    throw error;
  }
};
