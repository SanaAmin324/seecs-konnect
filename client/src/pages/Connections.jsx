import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, UserMinus, MessageCircle } from "lucide-react";

const Connections = () => {
  const { user } = useAuth();
  const { userId } = useParams(); // Get userId from URL params
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewedUserName, setViewedUserName] = useState("");
  
  const isOwnProfile = !userId || userId === user?._id;

  useEffect(() => {
    fetchConnections();
  }, [userId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConnections(connections);
    } else {
      const filtered = connections.filter((connection) =>
        connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.program?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConnections(filtered);
    }
  }, [searchQuery, connections]);

  const fetchConnections = async () => {
    try {
      const authUser = JSON.parse(localStorage.getItem("user"));
      const targetUserId = userId || authUser._id;
      
      const response = await fetch(
        `http://localhost:5000/api/profile/connections/${targetUserId}`,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConnections(data);
        setFilteredConnections(data);
        
        // If viewing someone else's profile, fetch their name
        if (!isOwnProfile) {
          const userResponse = await fetch(
            `http://localhost:5000/api/profile/${targetUserId}`,
            {
              headers: {
                Authorization: `Bearer ${authUser.token}`,
              },
            }
          );
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setViewedUserName(userData.name);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (connectionId) => {
    if (!confirm("Are you sure you want to remove this connection?")) return;

    try {
      const authUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(`http://localhost:5000/api/profile/disconnect/${connectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      if (response.ok) {
        setConnections(connections.filter((c) => c._id !== connectionId));
        setFilteredConnections(filteredConnections.filter((c) => c._id !== connectionId));
      } else {
        alert("Failed to remove connection");
      }
    } catch (error) {
      console.error("Error removing connection:", error);
      alert("Failed to remove connection");
    }
  };

  const handleViewProfile = (connection) => {
    if (connection.username) {
      navigate(`/u/${connection.username}`);
    } else {
      navigate(`/profile/${connection._id}`);
    }
  };

  const handleMessage = (connectionId) => {
    alert("Messaging feature coming soon!");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading connections...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            {isOwnProfile ? "My Connections" : `${viewedUserName}'s Connections`}
          </h1>
          <p className="text-muted-foreground mt-2">
            {connections.length} connection{connections.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search connections by name, email, or program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Connections Grid */}
        {filteredConnections.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? "No connections found" : "No connections yet"}
              </p>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search query"
                  : "Start connecting with other users to build your network"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnections.map((connection) => (
              <Card key={connection._id} className="hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Profile Picture */}
                    <div
                      onClick={() => handleViewProfile(connection)}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-white text-2xl font-bold mb-4 cursor-pointer hover:scale-105 transition overflow-hidden"
                    >
                      {connection.profilePicture ? (
                        <img
                          src={`http://localhost:5000${connection.profilePicture}`}
                          alt={connection.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        connection.name?.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Name and Info */}
                    <h3
                      onClick={() => handleViewProfile(connection)}
                      className="font-bold text-lg cursor-pointer hover:text-primary transition"
                    >
                      {connection.name}
                    </h3>
                    {connection.username && (
                      <p className="text-sm text-muted-foreground">
                        @{connection.username}
                      </p>
                    )}
                    {connection.headline && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {connection.headline}
                      </p>
                    )}
                    {connection.program && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {connection.program}
                        {connection.batch && ` • ${connection.batch}`}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4 w-full">
                      <Button
                        onClick={() => handleViewProfile(connection)}
                        className="flex-1"
                        size="sm"
                      >
                        View Profile
                      </Button>
                      {isOwnProfile && (
                        <Button
                          onClick={() => handleDisconnect(connection._id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Connections;
