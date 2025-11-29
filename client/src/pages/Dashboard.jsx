import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  // Lazy initialization from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // remove token + user
    setUser(null);
    navigate("/login");
  };

  if (!user) return null; // optional: render nothing until auth check

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard — Welcome {user.name} 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Welcome</h2>
            <p className="text-gray-600 mt-2">
              You are logged in as <strong>{user.role}</strong>.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Students</h2>
            <p className="text-gray-600 mt-2">Manage or view students.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Resources</h2>
            <p className="text-gray-600 mt-2">Access shared materials.</p>
          </CardContent>
        </Card>
      </div>

      <Button className="mt-10" variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
