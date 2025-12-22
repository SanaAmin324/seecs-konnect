import { useState, useEffect } from "react";
import { User, UserPlus, UserCheck, MessageCircle, Settings, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const ProfileHeader = ({ user, isOwnProfile }) => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : 'Unknown';

  // Get profile picture or generate avatar from first letter
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || '?';
  const profilePicture = user?.profilePicture;

  useEffect(() => {
    if (!isOwnProfile && user?._id) {
      fetchConnectionStatus();
    }
  }, [isOwnProfile, user?._id]);

  const fetchConnectionStatus = async () => {
    try {
      const authUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `http://localhost:5000/api/profile/connection-status/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConnectionStatus(data);
      }
    } catch (error) {
      console.error("Error fetching connection status:", error);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const authUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `http://localhost:5000/api/profile/connect/${user._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      if (response.ok) {
        await fetchConnectionStatus();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to send connection request");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Failed to send connection request");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      const authUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `http://localhost:5000/api/profile/accept/${user._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      if (response.ok) {
        await fetchConnectionStatus();
      }
    } catch (error) {
      console.error("Error accepting connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const authUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `http://localhost:5000/api/profile/reject/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      if (response.ok) {
        await fetchConnectionStatus();
      }
    } catch (error) {
      console.error("Error rejecting connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to remove this connection?")) return;
    
    setLoading(true);
    try {
      const authUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `http://localhost:5000/api/profile/disconnect/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      if (response.ok) {
        await fetchConnectionStatus();
      }
    } catch (error) {
      console.error("Error removing connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    alert("Messaging feature coming soon!");
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-6 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
        {profilePicture ? (
          <img
            src={`http://localhost:5000${profilePicture}`}
            alt={user?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          avatarLetter
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">{user?.name || 'User'}</h2>
          {user?.role === 'admin' && (
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">Admin</span>
          )}
        </div>
        {user?.headline && (
          <p className="text-sm text-foreground font-medium mt-1">{user.headline}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {user?.cms && `CMS: ${user.cms}`}
          {user?.cms && user?.role !== "admin" && " • "}
          {user?.role !== "admin" && `Joined ${joinDate}`}
          {user?.role === "admin" && (!user?.cms ? `Joined ${joinDate}` : ` • Joined ${joinDate}`)}
        </p>
        {(user?.program || user?.batch || user?.location) && (
          <p className="text-sm text-foreground mt-1">
            {user?.program && user?.role !== "admin" && `${user.program}`}
            {user?.batch && user?.role !== "admin" && ` • Batch ${user.batch}`}
            {user?.location && ` • ${user.location}`}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {isOwnProfile ? (
          <Button onClick={() => navigate("/settings")} variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <>
            {connectionStatus?.isConnected ? (
              <>
                <Button onClick={handleMessage} className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Button>
                <Button onClick={handleDisconnect} variant="outline" disabled={loading}>
                  <UserCheck className="w-4 h-4" />
                  Connected
                </Button>
              </>
            ) : connectionStatus?.requestReceived ? (
              <>
                <Button onClick={handleAccept} disabled={loading} className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Accept
                </Button>
                <Button onClick={handleReject} variant="outline" disabled={loading}>
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </>
            ) : connectionStatus?.requestSent ? (
              <Button variant="outline" disabled>
                <UserPlus className="w-4 h-4 mr-2" />
                Request Sent
              </Button>
            ) : (
              <Button onClick={handleConnect} disabled={loading} className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Connect
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
