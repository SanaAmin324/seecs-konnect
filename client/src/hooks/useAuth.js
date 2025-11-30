// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return { user, setUser, logout };
}
