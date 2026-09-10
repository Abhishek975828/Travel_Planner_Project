import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";

// This context holds "who is logged in" and shares it with the whole app,
// so we don't have to pass user/login/logout through every component's props.
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // "loading" is true only while we're checking localStorage on first load,
  // so ProtectedRoute doesn't redirect to /login before we've had a chance
  // to restore an existing session.
  const [loading, setLoading] = useState(true);

  // On first render, try to restore a previous session from localStorage.
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Saves the token + user both in React state and in localStorage,
  // so a page refresh doesn't log the user out.
  function saveSession(data) {
    const { token, ...userData } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  }

  async function login(email, password) {
    const response = await loginUser(email, password);
    saveSession(response.data);
  }

  async function register(name, email, password) {
    const response = await registerUser(name, email, password);
    saveSession(response.data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}