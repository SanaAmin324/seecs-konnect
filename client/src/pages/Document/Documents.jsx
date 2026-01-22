import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Search, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { formatTimeAgo } from "@/lib/timeUtils";
import { COURSE_LIST } from "@/lib/courses";
import { useNavigate } from "react-router-dom";

const Documents = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [favorites, setFavorites] = useState(new Set());
  const [favoriteDocs, setFavoriteDocs] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [courseInput, setCourseInput] = useState("");
  const [courseOptions, setCourseOptions] = useState([]);
  const [showCourseOptions, setShowCourseOptions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);

  // Load recently viewed from localStorage
  useEffect(() => {
    const rv = JSON.parse(localStorage.getItem("recentlyViewedDocuments") || "[]");
    setRecentlyViewed(rv);
  }, []);

  // Keep courseInput in sync with selectedCourse
  useEffect(() => {
    if (selectedCourse === "all" || !selectedCourse) {
      setCourseInput("");
    } else {
      const found = COURSE_LIST.find(c => c.code === selectedCourse);
      if (found) setCourseInput(`${found.code} - ${found.name}`);
    }
  }, [selectedCourse]);

  const [fetchedDocs, setFetchedDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const fetchDocuments = async ({ page = 1, limit = 6, title, course, category } = {}) => {
    try {
      setLoadingDocs(true);
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = user?.token;

      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", limit);
      if (title) params.set("title", title);
      if (course && course !== "all") params.set("course", course);
      if (category && category !== "all") params.set("category", category);

      const res = await fetch(`http://localhost:5000/api/documents?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        console.error("Failed to fetch documents", await res.text());
        setLoadingDocs(false);
        return;
      }
      const json = await res.json();
      const mapped = (json.documents || []).map((d) => ({
        id: d._id,
        title: d.title,
        course: d.course,
        type: d.category || "Unknown",
        instructor: d.uploader?.name || "",
        pages: d.files?.length || 0,
        uploader: {
          _id: d.uploader?._id,
          name: d.uploader?.name || "Unknown",
          username: d.uploader?.username || "",
          profilePicture: d.uploader?.profilePicture || null,
        },
        createdAt: d.createdAt,
        files: d.files || [],
      }));
      setFetchedDocs(mapped);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments({ page: 1, limit: 6 });
    fetchUserFavorites();
  }, []);

  const fetchUserFavorites = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = user?.token;
      if (!token) return;

      const res = await fetch("http://localhost:5000/api/documents/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        const favoriteIds = new Set(data.documents.map(doc => doc._id));
        setFavorites(favoriteIds);
        setFavoriteDocs(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  const toggleFavorite = async (docId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = user?.token;
      
      console.log("Toggle favorite clicked for doc:", docId);
      console.log("Token exists:", !!token);
      console.log("User object:", user);
      
      if (!token) {
        alert("You must be logged in to favorite documents.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/documents/${docId}/favorite`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });

      console.log("Response status:", res.status);
      const responseText = await res.text();
      console.log("Response text:", responseText);

      if (res.ok) {
        const data = JSON.parse(responseText);
        console.log("Response data:", data);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (data.isFavorited) {
            newFavorites.add(docId);
          } else {
            newFavorites.delete(docId);
          }
          return newFavorites;
        });
      } else {
        console.error("Failed to toggle favorite:", res.status, responseText);
        const errorData = JSON.parse(responseText);
        alert(`Failed to toggle favorite: ${errorData.message || responseText}${errorData.error ? '\n' + errorData.error : ''}`);
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
      alert(`Error: ${err.message}`);
    }
  };


  return (
    <MainLayout>
      <div className="min-h-screen flex w-full bg-linear-to-br from-background via-muted/10 to-background">
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <div className="flex items-center justify-between mb-8 animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                  Resources Library
                </h1>
                <p className="text-muted-foreground">Your cozy space for study materials</p>
              </div>
            </div>

            {/* Search and filter bar with autocomplete course search */}
            <Card className="card-soft mb-8 border-2 border-border/50 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input type="search" placeholder="Search by title, course, instructor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 rounded-2xl border-2 border-border/50 bg-background/50" />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Autocomplete course search */}
                  <div className="relative w-60">
                    <Input
                      type="text"
                      placeholder="Search course (type code or name)"
                      value={courseInput}
                      onChange={e => {
                        const val = e.target.value;
                        setCourseInput(val);
                        if (!val) {
                          setCourseOptions([]);
                          setShowCourseOptions(false);
                          setSelectedCourse("all");
                          return;
                        }
                        const filtered = COURSE_LIST.filter(c =>
                          c.code.toLowerCase().includes(val.toLowerCase()) || c.name.toLowerCase().includes(val.toLowerCase())
                        ).slice(0, 8);
                        setCourseOptions(filtered);
                        setShowCourseOptions(true);
                        setHighlightedIdx(-1);
                      }}
                      onFocus={() => {
                        if (courseInput) setShowCourseOptions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowCourseOptions(false), 150)}
                      onKeyDown={e => {
                        if (!showCourseOptions || courseOptions.length === 0) return;
                        if (e.key === "ArrowDown") {
                          setHighlightedIdx(idx => Math.min(idx + 1, courseOptions.length - 1));
                        } else if (e.key === "ArrowUp") {
                          setHighlightedIdx(idx => Math.max(idx - 1, 0));
                        } else if (e.key === "Enter") {
                          if (highlightedIdx >= 0 && highlightedIdx < courseOptions.length) {
                            const opt = courseOptions[highlightedIdx];
                            setCourseInput(`${opt.code} - ${opt.name}`);
                            setSelectedCourse(opt.code);
                            setShowCourseOptions(false);
                          } else if (courseOptions.length > 0) {
                            // If user presses Enter but hasn't highlighted, pick first
                            const opt = courseOptions[0];
                            setCourseInput(`${opt.code} - ${opt.name}`);
                            setSelectedCourse(opt.code);
                            setShowCourseOptions(false);
                          }
                        }
                      }}
                      className="rounded-2xl border-2 border-border/50 bg-background/50"
                    />
                    {showCourseOptions && courseOptions.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-border rounded-xl mt-1 shadow-lg max-h-56 overflow-auto">
                        {courseOptions.map((opt, idx) => (
                          <div
                            key={opt.code}
                            className={`px-4 py-2 cursor-pointer hover:bg-accent/20 ${highlightedIdx === idx ? 'bg-accent/10' : ''}`}
                            onMouseDown={() => {
                              setCourseInput(`${opt.code} - ${opt.name}`);
                              setSelectedCourse(opt.code);
                              setShowCourseOptions(false);
                            }}
                          >
                            {opt.code} - {opt.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px] rounded-2xl border-2 border-border/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="past-paper">Past Papers</SelectItem>
                      <SelectItem value="slides">Slides</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="ml-auto flex items-center gap-2">
                    <Button onClick={() => {
                      // If user typed but didn't select, pick best match
                      let course = selectedCourse;
                      if (courseInput && (course === "all" || !course)) {
                        const filtered = COURSE_LIST.filter(c =>
                          c.code.toLowerCase().includes(courseInput.toLowerCase()) || c.name.toLowerCase().includes(courseInput.toLowerCase())
                        );
                        if (filtered.length > 0) {
                          course = filtered[0].code;
                          setSelectedCourse(course);
                          setCourseInput(`${filtered[0].code} - ${filtered[0].name}`);
                        }
                      }
                      fetchDocuments({ title: searchQuery, course: course !== 'all' ? course : undefined, category: selectedType !== 'all' ? selectedType : undefined });
                    }}>Search</Button>
                    <Button variant="ghost" onClick={() => { setSearchQuery(''); setSelectedCourse('all'); setSelectedType('all'); setCourseInput(''); setCourseOptions([]); fetchDocuments({}); }}>Reset</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Favourites Section */}
            <div className="mb-10 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-foreground">Favourites</h2>
              </div>
              {favoriteDocs.length === 0 ? (
                <div className="text-muted-foreground mb-4">No favourites yet. Click the heart on any document to add it here.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {favoriteDocs.map((doc, idx) => (
                    <Card key={doc._id} className="card-soft hover-lift cursor-pointer border-2 border-border/50 animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-accent/20 to-primary/10 flex items-center justify-center text-4xl shrink-0">📄</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors mb-2">{doc.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <Badge className="rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-xs">{doc.course}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{doc.uploader?.name || ""}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {doc.createdAt ? formatTimeAgo(doc.createdAt) : "Unknown"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Recently Viewed Section */}
            <div className="mb-10 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Recently Viewed</h2>
              </div>
              {recentlyViewed.length === 0 ? (
                <div className="text-muted-foreground mb-4">No recently viewed documents yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {recentlyViewed.map((doc, idx) => (
                    <Card key={doc.id || doc._id || idx} className="card-soft hover-lift cursor-pointer border-2 border-border/50 animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-accent/20 to-primary/10 flex items-center justify-center text-4xl shrink-0">📄</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors mb-2">{doc.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <Badge className="rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-xs">{doc.course}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{doc.uploader?.name || ""}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {doc.createdAt ? formatTimeAgo(doc.createdAt) : "Unknown"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-10 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Recently Uploaded</h2>
                {loadingDocs && <span className="ml-3 text-sm text-muted-foreground">Loading...</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(fetchedDocs.length ? fetchedDocs : []).map((doc, idx) => (
                  <Card key={doc.id} className="card-soft hover-lift cursor-pointer border-2 border-border/50 animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-accent/20 to-primary/10 flex items-center justify-center text-4xl shrink-0">{doc.thumbnail || '📄'}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors mb-2">{doc.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge className="rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-xs">{doc.course}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{doc.instructor}</p>
                          
                          {/* Uploader info with avatar */}
                          <div className="flex items-center justify-between gap-2">
                            <div 
                              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (doc.uploader?.username) {
                                  navigate(`/u/${doc.uploader.username}`);
                                }
                              }}
                            >
                              <Avatar className="w-6 h-6 border border-border">
                                {doc.uploader?.profilePicture ? (
                                  <AvatarImage 
                                    src={`http://localhost:5000${doc.uploader.profilePicture}`} 
                                    alt={doc.uploader.name}
                                  />
                                ) : null}
                                <AvatarFallback className="text-xs">
                                  {doc.uploader?.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium text-foreground">{doc.uploader?.name || "Unknown"}</span>
                                {doc.uploader?.username && (
                                  <span className="text-xs text-muted-foreground">@{doc.uploader.username}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {doc.createdAt ? formatTimeAgo(doc.createdAt) : "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-6 flex gap-2">
                      <button 
                        className={`px-3 py-1 rounded flex items-center gap-1 transition-colors ${
                          favorites.has(doc.id) 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(doc.id);
                        }}
                      >
                        <Heart 
                          className="w-4 h-4" 
                          fill={favorites.has(doc.id) ? "currentColor" : "none"}
                        />
                        {favorites.has(doc.id) ? "Favorited" : "Favorite"}
                      </button>

                      <button className="px-3 py-1 rounded bg-primary text-white" onClick={async (e) => {
                        e.preventDefault();
                        try {
                          const user = JSON.parse(localStorage.getItem("user") || "null");
                          const token = user?.token;
                          const res = await fetch(`http://localhost:5000/api/documents/download/${doc.id}/0`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
                          if (!res.ok) throw new Error(await res.text());
                          const blob = await res.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a"); a.href = url; a.download = doc.files?.[0]?.originalName || `${doc.title}.pdf`; document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
                        } catch (err) { console.error(err); alert("Failed to download file"); }
                      }}>Download</button>

                      <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={async (e) => {
                        e.preventDefault();
                        if (!confirm("Delete this document?")) return;
                        try {
                          const user = JSON.parse(localStorage.getItem("user") || "null");
                          const token = user?.token;
                          console.log("Delete attempt for doc", doc.id, "token present:", !!token);
                          if (!token) {
                            alert("You must be logged in to delete a document.");
                            return;
                          }

                          const res = await fetch(`http://localhost:5000/api/documents/${doc.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          });

                          // Attempt to parse JSON or text message
                          let body = null;
                          const contentType = res.headers.get("content-type") || "";
                          if (contentType.includes("application/json")) {
                            body = await res.json();
                          } else {
                            const txt = await res.text();
                            body = txt ? { message: txt } : null;
                          }

                          if (!res.ok) {
                            console.error("Delete failed", { status: res.status, body });
                            const serverMsg = body?.message || body || `Delete failed (status ${res.status})`;
                            alert(`Delete failed: ${serverMsg}`);
                            return;
                          }

                          console.log("Delete success", { status: res.status, body });
                          alert(body?.message || "Deleted");
                          // Optimistically remove the deleted doc from UI
                          setFetchedDocs((prev) => prev.filter((d) => d.id !== doc.id));
                        } catch (err) {
                          console.error("Delete error", err);
                          alert(`Failed to delete document: ${err?.message || err}`);
                        }
                      }}>Delete</button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upload Prompt Card */}
            <Card
              className="card-soft mt-10 border-2 border-dashed border-primary/40 bg-linear-to-br from-primary/5 via-accent/5 to-secondary/5 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-linear-to-br from-primary via-accent to-secondary flex items-center justify-center animate-bounce-soft">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Share Your Knowledge</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">Help your fellow students by uploading your notes, study guides, or helpful resources</p>
                <Link to="/documents/upload">
                  <Button size="lg" className="gap-2 rounded-3xl bg-linear-to-r from-primary via-accent to-secondary hover:shadow-xl text-white hover-bounce px-10">
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
            className="fixed bottom-8 right-8 z-50 gap-2 rounded-full bg-linear-to-r from-primary via-accent to-secondary hover:shadow-2xl text-white hover-bounce px-6 py-6 h-auto shadow-xl"
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
