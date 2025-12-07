import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Upload,
  Star,
  Clock,
  TrendingUp,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import { useState } from "react";
import MainLayout from "../../layouts/Mainlayout";

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedInstructor, setSelectedInstructor] = useState("all");

  // Mock data
  const continueReading = [
    {
      id: 1,
      title: "Data Structures Lecture 8",
      course: "CS201",
      type: "Notes",
      instructor: "Dr. Khan",
      pages: 45,
      currentPage: 23,
      thumbnail: "📚",
    },
    {
      id: 2,
      title: "Database Systems Lab Manual",
      course: "CS301",
      type: "Lab Manual",
      instructor: "Dr. Ali",
      pages: 60,
      currentPage: 15,
      thumbnail: "💾",
    },
    {
      id: 3,
      title: "OOP Past Paper 2023",
      course: "CS102",
      type: "Past Paper",
      instructor: "Dr. Ahmed",
      pages: 8,
      currentPage: 3,
      thumbnail: "📝",
    },
  ];

  const starredDocs = [
    {
      id: 4,
      title: "Operating Systems Complete Notes",
      course: "CS202",
      type: "Notes",
      instructor: "Dr. Hassan",
      pages: 120,
      thumbnail: "🖥️",
      likes: 89,
    },
    {
      id: 5,
      title: "Compiler Construction Mid Prep",
      course: "CS402",
      type: "Study Guide",
      instructor: "Dr. Fatima",
      pages: 35,
      thumbnail: "⚙️",
      likes: 56,
    },
    {
      id: 6,
      title: "Algorithm Analysis Cheat Sheet",
      course: "CS301",
      type: "Reference",
      instructor: "Dr. Raza",
      pages: 12,
      thumbnail: "📊",
      likes: 102,
    },
  ];

  const popularDocs = [
    {
      id: 7,
      title: "Software Engineering Project Guide",
      course: "SE301",
      type: "Guide",
      instructor: "Dr. Sara",
      pages: 75,
      thumbnail: "🎯",
      likes: 145,
      downloads: 234,
    },
    {
      id: 8,
      title: "Computer Networks Lab Solutions",
      course: "CS303",
      type: "Solutions",
      instructor: "Dr. Usman",
      pages: 42,
      thumbnail: "🌐",
      likes: 98,
      downloads: 187,
    },
    {
      id: 9,
      title: "Web Development Tutorial Series",
      course: "CS205",
      type: "Tutorial",
      instructor: "Dr. Ayesha",
      pages: 88,
      thumbnail: "💻",
      likes: 167,
      downloads: 312,
    },
    {
      id: 10,
      title: "Mobile App Development Notes",
      course: "CS405",
      type: "Notes",
      instructor: "Dr. Zain",
      pages: 95,
      thumbnail: "📱",
      likes: 123,
      downloads: 245,
    },
  ];

  const recentUploads = [
    {
      id: 11,
      title: "Machine Learning Assignment 3",
      course: "CS401",
      type: "Assignment",
      instructor: "Dr. Nadia",
      pages: 15,
      thumbnail: "🤖",
      uploadedBy: "Ali Ahmed",
      timeAgo: "2 hours ago",
    },
    {
      id: 12,
      title: "Digital Image Processing Slides",
      course: "CS304",
      type: "Slides",
      instructor: "Dr. Bilal",
      pages: 52,
      thumbnail: "🎨",
      uploadedBy: "Sara Khan",
      timeAgo: "5 hours ago",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/10 to-background">
        {/* Decorative floating elements */}
        <div className="fixed top-10 right-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />
        <div
          className="fixed bottom-20 left-40 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-float pointer-events-none"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="fixed top-1/2 right-1/3 w-56 h-56 bg-accent/5 rounded-full blur-3xl animate-float pointer-events-none"
          style={{ animationDelay: "2s" }}
        />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                  Resources Library 📚
                </h1>
                <p className="text-muted-foreground">
                  Your cozy space for study materials
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <Card
              className="card-soft mb-8 border-2 border-border/50 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent className="p-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="search"
                    placeholder="Search by title, course, instructor... 🔍"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 rounded-2xl border-2 border-border/50 bg-background/50"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Filters:
                    </span>
                  </div>

                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger className="w-[180px] rounded-2xl border-2 border-border/50">
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="cs201">
                        CS201 - Data Structures
                      </SelectItem>
                      <SelectItem value="cs301">CS301 - Databases</SelectItem>
                      <SelectItem value="cs202">
                        CS202 - Operating Systems
                      </SelectItem>
                      <SelectItem value="se301">
                        SE301 - Software Eng
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px] rounded-2xl border-2 border-border/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="past-paper">Past Papers</SelectItem>
                      <SelectItem value="slides">Slides</SelectItem>
                      <SelectItem value="lab">Lab Manual</SelectItem>
                      <SelectItem value="guide">Study Guide</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedInstructor}
                    onValueChange={setSelectedInstructor}
                  >
                    <SelectTrigger className="w-[180px] rounded-2xl border-2 border-border/50">
                      <SelectValue placeholder="Instructor" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="all">All Instructors</SelectItem>
                      <SelectItem value="khan">Dr. Khan</SelectItem>
                      <SelectItem value="ali">Dr. Ali</SelectItem>
                      <SelectItem value="hassan">Dr. Hassan</SelectItem>
                      <SelectItem value="sara">Dr. Sara</SelectItem>
                    </SelectContent>
                  </Select>

                  {(selectedCourse !== "all" ||
                    selectedType !== "all" ||
                    selectedInstructor !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse("all");
                        setSelectedType("all");
                        setSelectedInstructor("all");
                      }}
                      className="rounded-2xl text-primary hover:bg-primary/10"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Continue Reading Section */}
            <div
              className="mb-10 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Continue Reading 📖
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {continueReading.map((doc, idx) => (
                  <Card
                    key={doc.id}
                    className="card-soft hover-lift cursor-pointer border-2 border-border/50 overflow-hidden animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/10 p-8 text-center">
                      <div className="text-6xl mb-2 animate-bounce-soft">
                        {doc.thumbnail}
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg hover:text-primary transition-colors">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-xs">
                            {doc.course}
                          </Badge>
                          <Badge className="rounded-full bg-secondary/20 text-secondary-foreground border border-secondary/30 text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {doc.instructor}
                        </p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress</span>
                          <span className="font-medium">
                            {doc.currentPage}/{doc.pages} pages
                          </span>
                        </div>
                        <div className="w-full bg-muted/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                            style={{
                              width: `${(doc.currentPage / doc.pages) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Starred Documents */}
            <div
              className="mb-10 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-primary fill-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Starred Documents ⭐
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {starredDocs.map((doc, idx) => (
                  <Card
                    key={doc.id}
                    className="card-soft hover-lift cursor-pointer border-2 border-primary/30 overflow-hidden animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="bg-gradient-to-br from-accent/20 via-primary/15 to-secondary/10 p-8 text-center relative">
                      <div className="text-6xl mb-2 animate-wiggle">
                        {doc.thumbnail}
                      </div>
                      <div className="absolute top-3 right-3">
                        <Star className="w-6 h-6 text-primary fill-primary animate-bounce-soft" />
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg hover:text-primary transition-colors">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-xs">
                            {doc.course}
                          </Badge>
                          <Badge className="rounded-full bg-accent/20 text-accent-foreground border border-accent/30 text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {doc.instructor}
                        </p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {doc.pages} pages
                        </span>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="font-medium">{doc.likes}</span>
                          <span className="text-muted-foreground">likes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Popular Documents */}
            <div
              className="mb-10 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Popular in Your Courses 🔥
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularDocs.map((doc, idx) => (
                  <Card
                    key={doc.id}
                    className="card-soft hover-lift cursor-pointer border-2 border-border/50 overflow-hidden animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="bg-gradient-to-br from-secondary/20 via-accent/15 to-primary/10 p-6 text-center">
                      <div className="text-5xl mb-2 animate-float">
                        {doc.thumbnail}
                      </div>
                    </div>
                    <CardHeader className="pb-2 px-4">
                      <CardTitle className="text-base hover:text-primary transition-colors line-clamp-2">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <Badge className="rounded-full bg-secondary/20 text-secondary-foreground border border-secondary/30 text-xs">
                          {doc.course}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-2 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {doc.instructor}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">
                          {doc.pages} pages
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">
                            ❤️ {doc.likes}
                          </span>
                          <span className="font-medium text-secondary">
                            ⬇️ {doc.downloads}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recently Uploaded */}
            <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">
                  Recently Uploaded 🆕
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentUploads.map((doc, idx) => (
                  <Card
                    key={doc.id}
                    className="card-soft hover-lift cursor-pointer border-2 border-border/50 animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center text-4xl flex-shrink-0">
                          {doc.thumbnail}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors mb-2">
                            {doc.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge className="rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-xs">
                              {doc.course}
                            </Badge>
                            <Badge className="rounded-full bg-accent/20 text-accent-foreground border border-accent/30 text-xs">
                              {doc.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {doc.instructor}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Uploaded by {doc.uploadedBy}</span>
                            <span>{doc.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upload Prompt Card */}
            <Card
              className="card-soft mt-10 border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center animate-bounce-soft">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Share Your Knowledge! 🌟
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Help your fellow students by uploading your notes, study
                  guides, or helpful resources
                </p>
                <Link to="/documents/upload">
                  <Button
                    size="lg"
                    className="gap-2 rounded-3xl bg-linear-to-r from-primary via-accent to-secondary hover:shadow-xl text-white hover-bounce px-10"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Your First Document
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Floating Upload Button */}
        <Link to="/documents/upload">
          <Button
            size="lg"
            className="fixed bottom-8 right-8 z-50 gap-2 rounded-full bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-2xl text-white hover-bounce px-6 py-6 h-auto shadow-xl"
          >
            <Upload className="w-6 h-6" />
            <span className="hidden md:inline">Upload Document</span>
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default Documents;
