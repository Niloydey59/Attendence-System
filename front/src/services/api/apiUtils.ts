import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Handle different error formats
    if (data?.error) {
      return {
        message: data.error,
        status,
        details: data,
      };
    }
    
    if (data?.message) {
      return {
        message: data.message,
        status,
        details: data,
      };
    }
    
    if (data?.detail) {
      return {
        message: data.detail,
        status,
        details: data,
      };
    }
    
    // Handle field errors
    if (data && typeof data === 'object') {
      const fieldErrors = Object.entries(data)
        .map(([field, errors]) => {
          if (Array.isArray(errors)) {
            return `${field}: ${errors.join(', ')}`;
          }
          return `${field}: ${errors}`;
        })
        .join('; ');
      
      if (fieldErrors) {
        return {
          message: fieldErrors,
          status,
          details: data,
        };
      }
    }
    
    // Default axios error message
    return {
      message: error.message || 'An error occurred',
      status,
      details: data,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: 'An unknown error occurred',
  };
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && !error.response;
};

export const isAuthError = (error: unknown): boolean => {
  return error instanceof AxiosError && error.response?.status === 401;
};
