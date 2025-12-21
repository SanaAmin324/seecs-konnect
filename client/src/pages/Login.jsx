import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 relative overflow-hidden">
      {/* Animated gradient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left gradient */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl opacity-60" style={{ animation: "float 8s ease-in-out infinite" }} />
        
        {/* Bottom right gradient */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-accent/25 to-transparent rounded-full blur-3xl opacity-50" style={{ animation: "float 10s ease-in-out infinite", animationDelay: "2s" }} />
        
        {/* Center right subtle gradient */}
        <div className="absolute top-1/3 -right-32 w-64 h-64 bg-gradient-to-l from-secondary/20 to-transparent rounded-full blur-3xl opacity-40" style={{ animation: "float 7s ease-in-out infinite", animationDelay: "1s" }} />
      </div>

      {/* Main Card - Center */}
      <Card className="w-full max-w-md shadow-2xl border border-border relative z-10 backdrop-blur-sm bg-white/95">
        <CardContent className="p-10 space-y-8">
          {/* Header with Icon */}
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white animate-pulse-soft" />
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">Sign in to your SEECS community account</p>
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm bg-red-50 rounded-lg p-3 border border-red-200">{error}</p>
          )}

          <div className="space-y-3">
            <Label className="text-foreground font-semibold text-sm">Email Address</Label>
            <Input
              type="email"
              placeholder="name@seecs.edu.pk"
              className="bg-input border-border text-foreground h-12 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-foreground font-semibold text-sm">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-input border-border text-foreground h-12 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold h-12 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 text-base"
            onClick={handleLogin}
          >
            Sign In
          </Button>

          <div className="pt-4 border-t border-border/50">
            <p className="text-center text-xs text-muted-foreground">
              Join thousands of SEECS students building their future together
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
