import React, { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken"),
  );

  const [loading, setLoading] = useState(true);

  // ==========================================
  // SAVE AUTH DATA
  // ==========================================

  const saveAuth = (data) => {
    if (data?.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
    }

    if (data?.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (formData) => {
    try {
      const response = await api.post("/auth/register", formData);

      saveAuth(response.data);

      return response.data;
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);

      throw error;
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Login response:", response.data);

      saveAuth(response.data);

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      throw error;
    }
  };

  // ==========================================
  // UPDATE USER
  // ==========================================

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setAccessToken(null);
    setUser(null);
  };

  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  const loadUser = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setAccessToken(token);

      const response = await api.get("/auth/profile");

      if (response.data?.user) {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error("Load user error:", error.response?.data || error.message);

      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    user,
    accessToken,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
