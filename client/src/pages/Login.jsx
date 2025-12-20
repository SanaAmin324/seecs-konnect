import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save user + token
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      // Redirect to intended page or dashboard
      navigate(location.state?.from || "/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server not responding");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm shadow-lg border">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center text-foreground">Login</h2>

          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="name@seecs.edu.pk"
              className="bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
