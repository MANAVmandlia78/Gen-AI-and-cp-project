import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('maharaja_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('maharaja_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Validate stored token against /api/auth/me on app load
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('maharaja_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('maharaja_user', JSON.stringify(data.user));
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        console.warn('Session verification fallback, keeping cached user if available:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('maharaja_token', data.token);
      localStorage.setItem('maharaja_user', JSON.stringify(data.user));

      return { success: true, user: data.user, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async ({ name, email, password, phone }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('maharaja_token', data.token);
      localStorage.setItem('maharaja_user', JSON.stringify(data.user));

      return { success: true, user: data.user, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('maharaja_token');
    localStorage.removeItem('maharaja_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    apiUrl: API_BASE_URL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
