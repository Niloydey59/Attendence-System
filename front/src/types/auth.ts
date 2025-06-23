export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  token: string;
  user_id: number;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_id: number;
  role: UserRole;
}

export interface AuthState {
  user: {
    id: number;
    role: UserRole;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}
