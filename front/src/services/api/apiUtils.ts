import { AxiosError } from 'axios';

export const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    // Check if it's an Axios error
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response && typeof axiosError.response.data === "object" && axiosError.response.data !== null) {
        const responseData = axiosError.response.data as { 
          detail?: string;
          message?: string;
          error?: string;
        };
        
        // Check for different error message fields that might exist in the response
        const errorMessage = responseData.detail || responseData.message || responseData.error || "An error occurred";
        throw new Error(errorMessage);
      } else if (axiosError.request) {
        throw new Error("No response received from the server");
      }
    }
    // Rethrow the original error if it's not an Axios error
    throw error;
  }
  // If it's not an Error instance, create a generic error
  throw new Error("An unknown error occurred");
};
