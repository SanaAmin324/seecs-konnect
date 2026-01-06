import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, User } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { useNavigate } from "react-router-dom";

// Module-level Map to prevent ANY duplicate processing across all renders
const globalProcessingMap = new Map();

// Function to format time ago (like Instagram)
function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedNotifications, setAcceptedNotifications] = useState(new Set());
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [processingIds, setProcessingIds] = useState(new Set());
  
  // Use ref for synchronous checking to prevent double-clicks
  const processingRef = useRef(new Set());

  useEffect(() => {
    // Always fetch fresh notifications when visiting this page
    const loadPage = async () => {
      console.log('Loading notifications page...');
      await fetchNotifications();
      console.log('Fetched notifications, now marking all as read...');
      // Mark all notifications as read (viewed)
      await markAllAsRead();
      console.log('Marked all as read on backend');
      // Wait a moment to ensure backend has processed
      await new Promise(resolve => setTimeout(resolve, 200));
      // Update local state to mark all as read
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      console.log('Updated local state, dispatching event...');
      // Trigger event to tell Navbar to refresh count immediately
      window.dispatchEvent(new Event('notificationsViewed'));
      console.log('Event dispatched');
    };
    loadPage();
  }, []); // Run on mount

  const markAllAsRead = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(
        `http://localhost:5000/api/notifications/mark-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        console.log("All notifications marked as read");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // Check connection status for each notification sender
  const checkConnectionStatus = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(
        `http://localhost:5000/api/profile/connection-status/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return data.status === "connected";
    } catch (error) {
      console.error("Error checking connection status:", error);
      return false;
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      console.log('Fetched notifications:', data);
      setNotifications(data);

      // Check connection status for each connection request notification
      const statusChecks = {};
      for (const notification of data) {
        if ((notification.type === "connection_request" || notification.type === "connection_accepted") && notification.from?._id) {
          const isConnected = await checkConnectionStatus(notification.from._id);
          console.log(`Connection status for ${notification.from.name}:`, isConnected);
          if (isConnected) {
            statusChecks[notification._id] = true;
          }
        }
      }
      console.log('Connection statuses:', statusChecks);
      setConnectionStatuses(statusChecks);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (notificationId, fromUserId, fromUserName) => {
    // FIRST: Check global map BEFORE any React state
    if (globalProcessingMap.has(notificationId)) {
      console.log('BLOCKED: Already processing globally:', notificationId);
      return;
    }
    
    // Immediately mark as processing at module level
    globalProcessingMap.set(notificationId, Date.now());
    console.log('Global map set for:', notificationId);
    
    // Synchronous check using ref to prevent race conditions
    if (processingRef.current.has(notificationId)) {
      console.log('Already processing notification (blocked by ref):', notificationId);
      globalProcessingMap.delete(notificationId);
      return;
    }
    
    // Also check state-based set
    if (processingIds.has(notificationId)) {
      console.log('Already processing notification (blocked by state):', notificationId);
      globalProcessingMap.delete(notificationId);
      return;
    }
    
    // Add to ref immediately (synchronous)
    processingRef.current.add(notificationId);
    console.log('Processing notification:', notificationId);
    
    // Immediately update UI to show as connected
    setConnectionStatuses(prev => ({ ...prev, [notificationId]: true }));
    setProcessingIds(prev => new Set(prev).add(notificationId));
    
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(
        `http://localhost:5000/api/profile/accept/${fromUserId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        console.log('Connection accepted successfully');
        
        // Mark notification as read
        await markAsRead(notificationId);
        
        // Update the notification in the state to mark as read
        setNotifications(prev => prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        ));
        
        // Trigger event to update navbar count immediately
        window.dispatchEvent(new Event('notificationsViewed'));
        
        console.log('Notification marked as read');
      } else {
        const error = await response.json();
        
        // If already connected, just show success message
        if (error.message && error.message.includes("already connected")) {
          console.log('Already connected - showing success message anyway');
          await markAsRead(notificationId);
          setNotifications(prev => prev.map(n => 
            n._id === notificationId ? { ...n, read: true } : n
          ));
          window.dispatchEvent(new Event('notificationsViewed'));
        } else {
          // Revert connection status on error
          setConnectionStatuses(prev => {
            const newStatuses = { ...prev };
            delete newStatuses[notificationId];
            return newStatuses;
          });
          
          alert(error.message || "Failed to accept connection request");
        }
      }
    } catch (error) {
      // Revert connection status on error
      setConnectionStatuses(prev => {
        const newStatuses = { ...prev };
        delete newStatuses[notificationId];
        return newStatuses;
      });
      
      console.error("Error accepting connection:", error);
      alert("Failed to accept connection request. Please try again.");
    } finally {
      // Remove from ref and state
      processingRef.current.delete(notificationId);
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
      
      // Remove from global map after a delay to prevent rapid re-clicks
      setTimeout(() => {
        globalProcessingMap.delete(notificationId);
        console.log('Global map cleared for:', notificationId);
      }, 2000); // 2 second cooldown
    }
  };

  const handleReject = async (notificationId, fromUserId) => {
    // FIRST: Check global map BEFORE any React state
    if (globalProcessingMap.has(notificationId)) {
      console.log('BLOCKED: Already rejecting globally:', notificationId);
      return;
    }
    
    // Immediately mark as processing at module level
    globalProcessingMap.set(notificationId, Date.now());
    
    // Synchronous check using ref to prevent race conditions
    if (processingRef.current.has(notificationId)) {
      console.log('Already processing notification (blocked by ref):', notificationId);
      globalProcessingMap.delete(notificationId);
      return;
    }
    
    // Also check state-based set
    if (processingIds.has(notificationId)) {
      console.log('Already processing notification (blocked by state):', notificationId);
      globalProcessingMap.delete(notificationId);
      return;
    }
    
    // Add to ref immediately (synchronous)
    processingRef.current.add(notificationId);
    console.log('Rejecting notification:', notificationId);
    
    setProcessingIds(prev => new Set(prev).add(notificationId));
    
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(
        `http://localhost:5000/api/profile/reject/${fromUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Mark notification as read and remove from list
        await markAsRead(notificationId);
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        
        // Trigger event to update navbar count immediately
        window.dispatchEvent(new Event('notificationsViewed'));
      } else {
        const error = await response.json();
        alert(error.message || "Failed to reject connection request");
      }
    } catch (error) {
      console.error("Error rejecting connection:", error);
      alert("Failed to reject connection request. Please try again.");
    } finally {
      // Remove from ref and state
      processingRef.current.delete(notificationId);
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
      
      // Remove from global map after a delay
      setTimeout(() => {
        globalProcessingMap.delete(notificationId);
      }, 2000);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification._id);
    
    // Navigate to post if it's a post-related notification
    if (notification.type === 'post_like' || notification.type === 'post_comment' || notification.type === 'post_repost') {
      if (notification.post) {
        navigate(`/forum/post/${notification.post}`);
      }
    } else if (notification.from) {
      // Navigate to the user's profile
      const fromUser = notification.from;
      if (fromUser.username) {
        navigate(`/u/${fromUser.username}`);
      }
    }
    
    fetchNotifications();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        {notifications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No notifications yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification._id}
                className="p-4 bg-card"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    {notification.from?.profilePicture ? (
                      <AvatarImage
                        src={`http://localhost:5000${notification.from.profilePicture}`}
                        alt={notification.from.name}
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1">
                    <p className="text-sm mb-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(notification.createdAt)}
                    </p>

                    {/* Show connected message for accepted connections */}
                    {notification.type === "connection_accepted" && (
                      <div className="flex items-center gap-2 mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          You are now connected
                        </p>
                      </div>
                    )}

                    {/* Show connected message for connection requests that are now connected */}
                    {notification.type === "connection_request" && connectionStatuses[notification._id] && (
                      <div className="flex items-center gap-2 mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          You are now connected with {notification.from?.name}
                        </p>
                      </div>
                    )}

                    {/* Show accept/reject buttons for pending connection requests */}
                    {notification.type === "connection_request" &&
                      !connectionStatuses[notification._id] && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            disabled={processingIds.has(notification._id)}
                            style={{ pointerEvents: processingIds.has(notification._id) ? 'none' : 'auto' }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAccept(notification._id, notification.from._id, notification.from?.name);
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            {processingIds.has(notification._id) ? "Accepting..." : "Accept"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingIds.has(notification._id)}
                            style={{ pointerEvents: processingIds.has(notification._id) ? 'none' : 'auto' }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleReject(notification._id, notification.from._id);
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            {processingIds.has(notification._id) ? "Rejecting..." : "Reject"}
                          </Button>
                        </div>
                      )}

                    {/* Show view profile button for other notification types */}
                    {notification.type !== "connection_request" &&
                      notification.type !== "connection_accepted" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          {notification.type === 'post_like' || notification.type === 'post_comment' || notification.type === 'post_repost' 
                            ? 'View Post' 
                            : 'View Profile'}
                        </Button>
                      )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
