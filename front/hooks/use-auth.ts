"use client";

import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "@/src/services/features/authService";

interface User {
  id: string;
  role: 'STUDENT' | 'TEACHER';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userId = localStorage.getItem('user_id');
        const userRole = localStorage.getItem('user_role') as 'STUDENT' | 'TEACHER';
        
        if (userId && userRole) {
          setUser({ id: userId, role: userRole });
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: handleLogout,
  };
}
