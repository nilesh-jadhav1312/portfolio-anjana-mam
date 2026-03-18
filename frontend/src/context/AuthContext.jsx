import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const SESSION_DURATION_MS = 10 * 60 * 1000;
const SESSION_EXPIRY_KEY = "adminSessionExpiry";

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");
    const expiryRaw = localStorage.getItem(SESSION_EXPIRY_KEY);
    const expiry = expiryRaw ? Number(expiryRaw) : null;

    if (token && adminData) {
      const resolvedExpiry = expiry || Date.now() + SESSION_DURATION_MS;
      if (Date.now() > resolvedExpiry) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        localStorage.removeItem(SESSION_EXPIRY_KEY);
      } else {
        localStorage.setItem(SESSION_EXPIRY_KEY, String(resolvedExpiry));
        setAdmin(JSON.parse(adminData));
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data));
      localStorage.setItem(SESSION_EXPIRY_KEY, String(expiresAt));
      setAdmin(data);
      toast.success("Login successful");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = (options = {}) => {
    const { silent = false } = options;
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    setAdmin(null);
    if (!silent) {
      toast.info("Logged out");
    }
  };

  const updateCredentials = async ({ newUsername, newPassword }) => {
    try {
      const { data } = await api.put("/auth/update", {
        newUsername,
        newPassword,
      });

      const expiresAt = Date.now() + SESSION_DURATION_MS;
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data));
      localStorage.setItem(SESSION_EXPIRY_KEY, String(expiresAt));
      setAdmin(data);
      toast.success("Admin credentials updated");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      return false;
    }
  };

  useEffect(() => {
    if (!admin) return undefined;
    const expiryRaw = localStorage.getItem(SESSION_EXPIRY_KEY);
    const expiry = expiryRaw ? Number(expiryRaw) : null;

    if (!expiry) return undefined;
    const timeLeft = expiry - Date.now();

    if (timeLeft <= 0) {
      logout({ silent: true });
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      logout({ silent: true });
    }, timeLeft);

    return () => window.clearTimeout(timeoutId);
  }, [admin, logout]);

  useEffect(() => {
    if (!admin) return undefined;

    const handleBeforeUnload = () => {
      logout({ silent: true });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [admin, logout]);

  return (
    <AuthContext.Provider
      value={{ admin, login, logout, loading, updateCredentials }}
    >
      {children}
    </AuthContext.Provider>
  );
};
