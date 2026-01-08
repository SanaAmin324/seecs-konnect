import { useState, useEffect } from "react";
import { User, UserPlus, UserCheck, MessageCircle, Settings, X, Check, UserMinus } from "lucide-react";
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

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      const authUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `http://localhost:5000/api/profile/cancel-request/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      if (response.ok) {
        await fetchConnectionStatus();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to cancel connection request");
      }
    } catch (error) {
      console.error("Error canceling connection request:", error);
      alert("Failed to cancel connection request");
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
    // Navigate to messages page with this user's ID
    navigate(`/messages?userId=${user._id}`);
  };

  return (
    <div className="bg-card rounded-xl border border-border animate-fade-in">
      {/* Header Section with Profile Picture and Info */}
      <div className="p-6 flex items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden flex-shrink-0">
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

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">{user?.name || 'User'}</h2>
            {user?.role === 'admin' && (
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">Admin</span>
            )}
          </div>
          {user?.username && (
            <p className="text-sm text-muted-foreground font-medium">@{user.username}</p>
          )}
          {user?.headline && (
            <p className="text-sm text-foreground font-medium mt-1">{user.headline}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">
              Joined {joinDate}
            </p>
            {user?.connections && (
              <>
                <span className="text-muted-foreground">•</span>
                <button
                  onClick={() => {
                    if (isOwnProfile) {
                      navigate('/connections');
                    } else {
                      navigate(`/connections/${user._id}`);
                    }
                  }}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {user.connections.length} connection{user.connections.length !== 1 ? 's' : ''}
                </button>
              </>
            )}
          </div>
          
          {/* Bio Section - Like Instagram/LinkedIn */}
          {user?.bio && (
            <p className="text-sm text-foreground mt-3 whitespace-pre-line leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons - Separated Section */}
      <div className="px-6 pb-6 flex items-center gap-3 border-t border-border pt-4">
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
                <Button 
                  onClick={handleDisconnect} 
                  variant="outline" 
                  disabled={loading}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <UserMinus className="w-4 h-4" />
                  Remove Connection
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
              <Button onClick={handleCancelRequest} variant="outline" disabled={loading}>
                <X className="w-4 h-4 mr-2" />
                Cancel Request
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
