
import { useState, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { AuthService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (username: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const userProfile = await AuthService.login(username, password, role);
      setUser(userProfile);
      return userProfile;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  return {
    user,
    isManager: user?.role === 'Manager',
    isLoading,
    error,
    handleLogin,
    handleLogout
  };
};
