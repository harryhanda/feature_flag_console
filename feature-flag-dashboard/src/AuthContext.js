import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import * as authService from "./api/authService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function decodeUser(token) {
  const decoded = jwtDecode(token);
  return { _id: decoded._id, email: decoded.email, role: decoded.role };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      delete axios.defaults.headers.common["Authorization"];
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(decodeUser(token));
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const newToken = res.data.data.token;

    localStorage.setItem("token", newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(decodeUser(newToken));
  };

  // This is what RegisterPage.jsx was missing — it called
  // `const { register } = useAuth()` but AuthContext never exposed it,
  // so submitting the register form crashed with "register is not a
  // function". Registration does NOT log the user in (backend always
  // creates a "viewer" and expects them to log in separately).
  const register = async (email, password, name) => {
    await authService.register(email, password, name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
