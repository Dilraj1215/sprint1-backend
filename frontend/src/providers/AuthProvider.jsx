import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (!email || !password) throw new Error('Please fill in all fields');
    const u = { username: email.split('@')[0], email };
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const register = (username, email, password) => {
    if (!username || !email || !password) throw new Error('Please fill in all fields');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    const u = { username, email };
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
