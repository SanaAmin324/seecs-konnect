import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // you can later add real auth logic here
    navigate("/dashboard"); // redirect to dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm shadow-lg border">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center text-foreground">Login</h2>

          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" placeholder="name@seecs.edu.pk" className="bg-background"/>
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-background"/>
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
