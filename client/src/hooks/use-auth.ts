
import { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the current user
    async function fetchCurrentUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Invalid credentials' 
        };
      }
    } catch (error) {
      console.error('Login error', error);
      return { 
        success: false, 
        error: 'An error occurred during login' 
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
