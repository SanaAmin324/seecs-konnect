import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, User, FileText, Loader2, FolderOpen } from "lucide-react";
import PostCard from "@/components/Forum/PostCard";

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialFilter = searchParams.get("filter") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState(initialFilter);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    users: [],
    posts: [],
    documents: [],
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialFilter);
    }
  }, [initialQuery, initialFilter]);

  const performSearch = async (searchQuery, searchFilter) => {
    if (!searchQuery.trim()) {
      setResults({ users: [], posts: [], documents: [] });
      return;
    }

    setLoading(true);
    try {
      const searchPromises = [];

      // Search users if filter is 'all' or 'users'
      if (searchFilter === "all" || searchFilter === "users") {
        searchPromises.push(
          fetch(`http://localhost:5000/api/profile/search?q=${encodeURIComponent(searchQuery)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.json())
        );
      } else {
        searchPromises.push(Promise.resolve([]));
      }

      // Search posts if filter is 'all' or 'posts'
      if (searchFilter === "all" || searchFilter === "posts") {
        searchPromises.push(
          fetch(`http://localhost:5000/api/forums/search?q=${encodeURIComponent(searchQuery)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.json())
        );
      } else {
        searchPromises.push(Promise.resolve([]));
      }

      // Search documents if filter is 'all' or 'documents'
      if (searchFilter === "all" || searchFilter === "documents") {
        searchPromises.push(
          fetch(`http://localhost:5000/api/documents/search?q=${encodeURIComponent(searchQuery)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.json())
        );
      } else {
        searchPromises.push(Promise.resolve({ documents: [] }));
      }

      const [users, posts, documentsResponse] = await Promise.all(searchPromises);

      setResults({
        users: users || [],
        posts: posts || [],
        documents: documentsResponse?.documents || [],
      });
    } catch (error) {
      console.error("Search error:", error);
      setResults({ users: [], posts: [], documents: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    navigate(`/search?q=${encodeURIComponent(query)}&filter=${filter}`);
    performSearch(query, filter);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}&filter=${newFilter}`);
      performSearch(query, newFilter);
    }
  };

  const totalResults = results.users.length + results.posts.length + results.documents.length;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Search Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <SearchIcon className="w-8 h-8 text-primary" />
            Search
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for users, posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </Button>
          </form>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "users" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("users")}
            >
              <User className="w-4 h-4 mr-1" />
              Users ({results.users.length})
            </Button>
            <Button
              variant={filter === "posts" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("posts")}
            >
              <FileText className="w-4 h-4 mr-1" />
              Posts ({results.posts.length})
            </Button>
            <Button
              variant={filter === "documents" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("documents")}
            >
              <FolderOpen className="w-4 h-4 mr-1" />
              Documents ({results.documents.length})
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Searching...</p>
            </CardContent>
          </Card>
        ) : query && totalResults === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No results found</p>
              <p className="text-muted-foreground">
                Try different keywords or check your spelling
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Users Results */}
            {(filter === "all" || filter === "users") && results.users.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Users ({results.users.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.users.map((user) => (
                    <Card
                      key={user._id}
                      className="hover:shadow-lg transition cursor-pointer"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold overflow-hidden flex-shrink-0">
                            {user.profilePicture ? (
                              <img
                                src={`http://localhost:5000${user.profilePicture}`}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate">{user.name}</h3>
                            {user.username && (
                              <p className="text-sm text-primary truncate">@{user.username}</p>
                            )}
                            {user.headline && (
                              <p className="text-sm text-muted-foreground truncate">{user.headline}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Results */}
            {(filter === "all" || filter === "posts") && results.posts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Posts ({results.posts.length})
                </h2>
                <div className="space-y-4">
                  {results.posts.map((post) => (
                    <PostCard key={post._id} post={post} viewType="card" />
                  ))}
                </div>
              </div>
            )}

            {/* Documents Results */}
            {(filter === "all" || filter === "documents") && results.documents.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  Documents ({results.documents.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.documents.map((doc) => (
                    <Card
                      key={doc._id}
                      className="hover:shadow-lg transition cursor-pointer"
                      onClick={() => navigate(`/documents/${doc._id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FolderOpen className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate mb-1">{doc.title}</h3>
                            {doc.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {doc.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 text-xs">
                              {doc.course && (
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                                  {doc.course}
                                </span>
                              )}
                              {doc.category && (
                                <span className="px-2 py-1 bg-secondary/10 text-secondary rounded">
                                  {doc.category}
                                </span>
                              )}
                            </div>
                            {doc.uploader && (
                              <p className="text-xs text-muted-foreground mt-2">
                                By {doc.uploader.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Search;
