import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // If no user in localStorage → redirect to login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required but user is not admin → redirect to forums
  if (requireAdmin) {
    const isAdmin = user.role === "admin";
    console.log("Admin check:", { user, isAdmin, role: user.role });
    if (!isAdmin) {
      return <Navigate to="/forums" replace />;
    }
  }

  return children; 
}
