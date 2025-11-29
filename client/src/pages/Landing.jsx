import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MessageSquare, Users, FileText, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Documents",
      description: "Share and discover study materials",
      color: "bg-primary/20",
    },
    {
      icon: MessageSquare,
      title: "Forum",
      description: "Ask questions, help peers",
      color: "bg-secondary/20",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with classmates",
      color: "bg-accent/20",
    },
    {
      icon: BookOpen,
      title: "Courses",
      description: "Browse course resources",
      color: "bg-peach/40",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Whimsical floating shapes */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="fixed top-1/2 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg animate-wiggle">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              SEECS Hub
            </h1>
          </div>
          <Button 
            onClick={() => navigate("/login")} 
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover-bounce"
          >
            Login
          </Button>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6 animate-scale-in">
            <Heart className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Welcome to SEECS</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Your Cozy
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              Academic Community
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            A warm, friendly space for SEECS students to share, learn, and grow together 🌱
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-xl text-primary-foreground hover-bounce px-8"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full border-2 border-primary/30 hover:bg-primary/10 hover-bounce px-8"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            What makes us special ✨
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card 
                key={idx}
                className="card-soft hover-lift cursor-pointer border-2 border-border/50 animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-8 h-8 text-foreground" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center">
          <Card className="card-soft bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-2 border-primary/20">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Ready to join our community? 🎉
              </h3>
              <p className="text-muted-foreground mb-6">
                Connect with fellow SEECS students, share resources, and make learning fun!
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/login")}
                className="rounded-full bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-xl text-white hover-bounce px-10"
              >
                Join SEECS Hub
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
