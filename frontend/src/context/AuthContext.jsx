import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("imp-user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("imp-token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await axiosInstance.get("/auth/me");
        setUser(res.data.data);
        localStorage.setItem("imp-user", JSON.stringify(res.data.data));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [token]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("imp-user", JSON.stringify(userData));
    localStorage.setItem("imp-token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("imp-user");
    localStorage.removeItem("imp-token");
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("imp-user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
