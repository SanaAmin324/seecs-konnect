// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Ensure the user object has _id field
        if (parsed && !parsed._id && parsed.id) {
          parsed._id = parsed.id;
        }
        return parsed;
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        return null;
      }
    }
    return null;
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
