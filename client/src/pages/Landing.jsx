import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MessageSquare, Users, FileText, Sparkles, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CloudGroup } from "@/components/decorative/FloatingCloud";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Study Materials",
      description: "Share and discover comprehensive study resources from your peers",
      color: "bg-primary/20",
    },
    {
      icon: MessageSquare,
      title: "Interactive Forum",
      description: "Ask questions, provide answers, and learn together in real-time",
      color: "bg-secondary/20",
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with classmates and build meaningful relationships",
      color: "bg-accent/20",
    },
    {
      icon: BookOpen,
      title: "Course Resources",
      description: "Access organized course materials and study guides",
      color: "bg-primary/15",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Floating Clouds */}
      <CloudGroup count={4} />

      {/* Whimsical floating shapes */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="fixed top-1/2 right-1/4 w-48 h-48 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-24">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg animate-cute-bounce">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tight">
              SEECS Konnect
            </h1>
          </div>
          <Button 
            onClick={() => navigate("/login")} 
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Sign In
          </Button>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-32">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-5 py-2 rounded-full mb-8 animate-fade-in border border-primary/30">
            <Heart className="w-4 h-4 text-primary animate-cute-bounce" style={{ animationDelay: "0.2s" }} />
            <span className="text-sm font-semibold text-primary tracking-wide">Welcome to Our Community</span>
          </div>
          
          <h2 className="text-7xl md:text-8xl font-black mb-8 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent block">
              Your Academic
            </span>
            <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent block">
              Community Hub
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            A warm and welcoming space where SEECS students connect, collaborate, and excel together through shared knowledge and genuine support.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-2xl text-white text-lg px-10 py-6 font-semibold transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full border-2 border-primary/40 hover:bg-primary/5 text-primary font-semibold text-lg px-10 py-6 transition-all duration-300 hover:border-primary/60"
            >
              Explore More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              Why Join SEECS Konnect?
            </h3>
            <p className="text-lg text-muted-foreground">Discover the features that make learning collaborative and enjoyable</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Card 
                key={idx}
                className="border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-fade-in group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-3 text-foreground">{feature.title}</h4>
                  <p className="text-base text-muted-foreground leading-relaxed flex-grow">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardContent className="p-16">
              <h3 className="text-4xl font-bold mb-5 text-foreground text-center leading-tight">
                Ready to Join Our Community?
              </h3>
              <p className="text-lg text-muted-foreground mb-10 text-center max-w-xl mx-auto">
                Connect with fellow SEECS students, share valuable resources, collaborate on projects, and make your academic journey more enjoyable.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="rounded-full bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-2xl text-white font-semibold text-lg px-12 py-6 transition-all duration-300 hover:scale-105"
                >
                  Join SEECS Konnect Today
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
