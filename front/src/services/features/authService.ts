import apiClient from '../api/apiClient';
import { handleApiError } from '../api/apiUtils';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse 
} from '@/src/types/auth';

export const login = async (userData: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login/', userData);
    
    // Store the token in local storage
    if (response.data.token) {
      localStorage.setItem('access_token', response.data.token);
      localStorage.setItem('user_id', response.data.user_id.toString());
      localStorage.setItem('user_role', response.data.role);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>('/auth/register/', userData);
    
    // Store the token in local storage upon successful registration
    if (response.data.token) {
      localStorage.setItem('access_token', response.data.token);
      localStorage.setItem('user_id', response.data.user_id.toString());
      localStorage.setItem('user_role', response.data.role);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_role');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('access_token') !== null;
};
