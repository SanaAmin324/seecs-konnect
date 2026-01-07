import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, User, Smile, MoreVertical, Trash2 } from "lucide-react";

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Common emojis
  const emojis = ['😀', '😂', '😍', '😊', '😢', '😎', '😡', '👍', '👏', '🙏', '❤️', '🔥', '✨', '🎉', '💯', '👀', '🤔', '😅', '🥺', '💪'];
  
  // Reaction emojis
  const reactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  const scrollToBottom = () => {
    if (shouldScrollToBottom && !userScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Only scroll to bottom when user sends a message
  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  // Detect when user scrolls up
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    setUserScrolled(!isAtBottom);
  };

  useEffect(() => {
    fetchConversations();
    // Check if there's a userId in query params (for starting new conversation)
    const userId = searchParams.get('userId');
    if (userId) {
      startConversationWithUser(userId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.otherUser._id);
      // Mark as read
      markConversationAsRead(selectedConversation.otherUser._id);
      // Poll for new messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedConversation.otherUser._id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const startConversationWithUser = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await response.json();
      
      setSelectedConversation({
        conversationId: `${user._id}_${userId}`,
        otherUser: userData,
        lastMessage: null,
        unreadCount: 0
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch("http://localhost:5000/api/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(`http://localhost:5000/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markConversationAsRead = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      await fetch(`http://localhost:5000/api/messages/${userId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh conversations to update unread count
      fetchConversations();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(
        `http://localhost:5000/api/messages/${selectedConversation.otherUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ content: newMessage })
        }
      );

      if (response.ok) {
        setNewMessage("");
        setShouldScrollToBottom(true); // Scroll to bottom when user sends message
        fetchMessages(selectedConversation.otherUser._id);
        fetchConversations(); // Update conversation list
        // Keep focus on input after sending
        setTimeout(() => messageInputRef.current?.focus(), 100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    if (!message.deleted) {
      setContextMenu({
        x: e.pageX,
        y: e.pageY,
        messageId: message._id,
        isOwn: message.sender._id === user._id
      });
    }
  };

  const handleLongPressStart = (message) => {
    if (!message.deleted) {
      const timer = setTimeout(() => {
        setContextMenu({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          messageId: message._id,
          isOwn: message.sender._id === user._id
        });
      }, 500); // 500ms for long press
      setLongPressTimer(timer);
    }
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const unsendMessage = async (messageId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchMessages(selectedConversation.otherUser._id);
        setContextMenu(null);
      }
    } catch (error) {
      console.error("Error unsending message:", error);
    }
  };

  const deleteMessageForMe = async (messageId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}/for-me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchMessages(selectedConversation.otherUser._id);
        setContextMenu(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const reactToMessage = async (messageId, emoji) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}/react`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ emoji })
      });

      if (response.ok) {
        fetchMessages(selectedConversation.otherUser._id);
        setShowReactionPicker(null);
      }
    } catch (error) {
      console.error("Error reacting to message:", error);
    }
  };

  const removeReaction = async (messageId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}/react`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchMessages(selectedConversation.otherUser._id);
      }
    } catch (error) {
      console.error("Error removing reaction:", error);
    }
  };

  // Close context menu and reaction picker when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
      setShowReactionPicker(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">Loading messages...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversation?.conversationId === conv.conversationId
                      ? 'bg-accent'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      {conv.otherUser.profilePicture ? (
                        <AvatarImage
                          src={`http://localhost:5000${conv.otherUser.profilePicture}`}
                          alt={conv.otherUser.name}
                        />
                      ) : (
                        <AvatarFallback>
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold truncate">{conv.otherUser.name}</h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage.senderId.toString() === user._id
                            ? 'You: '
                            : ''}
                          {conv.lastMessage.content}
                        </p>
                      )}
                      {conv.unreadCount > 0 && (
                        <span className="inline-block mt-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  {selectedConversation.otherUser.profilePicture ? (
                    <AvatarImage
                      src={`http://localhost:5000${selectedConversation.otherUser.profilePicture}`}
                      alt={selectedConversation.otherUser.name}
                    />
                  ) : (
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedConversation.otherUser.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    @{selectedConversation.otherUser.username}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4"
                ref={messagesContainerRef}
                onScroll={handleScroll}
              >
                {messages.map((message, index) => {
                  const isOwn = message.sender._id === user._id;
                  const userReaction = message.reactions?.find(r => r.user._id === user._id);
                  const hasReactions = !message.deleted && message.reactions && message.reactions.length > 0;
                  
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${hasReactions ? 'mb-4' : 'mb-1'}`}
                    >
                      <div className="relative group max-w-[75%]">
                        <div
                          className={`inline-block rounded-2xl px-3 py-2 shadow-sm ${
                            message.deleted 
                              ? 'bg-muted/50 italic text-muted-foreground'
                              : isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                          }`}
                          onContextMenu={(e) => handleContextMenu(e, message)}
                          onTouchStart={() => handleLongPressStart(message)}
                          onTouchEnd={handleLongPressEnd}
                          onMouseDown={() => handleLongPressStart(message)}
                          onMouseUp={handleLongPressEnd}
                          onMouseLeave={handleLongPressEnd}
                        >
                          <p className="break-words text-sm leading-relaxed">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 text-[10px] ${isOwn ? 'text-primary-foreground/70 justify-end' : 'text-muted-foreground'}`}>
                            <span>{formatTime(message.createdAt)}</span>
                            {isOwn && !message.deleted && (
                              <span>
                                {message.read ? ' · Seen' : ' · Sent'}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Reactions */}
                        {!message.deleted && message.reactions && message.reactions.length > 0 && (
                          <div className={`absolute -bottom-3 ${isOwn ? 'right-0' : 'left-0'} flex gap-0.5 bg-card border border-border rounded-full px-1.5 py-0.5 shadow-md`}>
                            {message.reactions.map((reaction, idx) => (
                              <span key={idx} className="text-xs leading-none">{reaction.emoji}</span>
                            ))}
                          </div>
                        )}
                        
                        {/* Quick reaction button */}
                        {!message.deleted && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowReactionPicker(showReactionPicker === message._id ? null : message._id);
                            }}
                            className={`absolute -top-1 ${isOwn ? 'left-0 -translate-x-8' : 'right-0 translate-x-8'} opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded-full p-1.5 shadow-md hover:bg-accent`}
                          >
                            <Smile className="w-3.5 h-3.5" />
                          </button>
                        )}
                        
                        {/* Reaction picker */}
                        {showReactionPicker === message._id && (
                          <div className={`absolute ${isOwn ? 'right-0' : 'left-0'} top-10 bg-card border border-border rounded-xl shadow-xl p-3 z-50 flex gap-2 items-center`}>
                            {reactionEmojis.map((emoji, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (userReaction) {
                                    removeReaction(message._id);
                                  } else {
                                    reactToMessage(message._id, emoji);
                                  }
                                }}
                                className="text-2xl hover:bg-accent hover:scale-110 rounded-lg p-2 transition-all"
                              >
                                {emoji}
                              </button>
                            ))}
                            {userReaction && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeReaction(message._id);
                                }}
                                className="text-xs px-2 py-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors border-l border-border ml-1 pl-2"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-border bg-card relative">
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-20 right-4 bg-card border border-border rounded-lg shadow-lg p-3 z-10">
                    <div className="grid grid-cols-5 gap-2 max-w-xs">
                      {emojis.map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => addEmoji(emoji)}
                          className="text-2xl hover:bg-accent rounded p-1 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 items-center">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex-shrink-0"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    disabled={sending}
                    autoFocus
                  />
                  <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu for Unsend/Delete */}
      {contextMenu && (
        <div
          className="fixed bg-card border border-border rounded-lg shadow-lg py-1 z-50 min-w-[150px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.isOwn && (
            <button
              onClick={() => unsendMessage(contextMenu.messageId)}
              className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Unsend
            </button>
          )}
          <button
            onClick={() => deleteMessageForMe(contextMenu.messageId)}
            className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete for me
          </button>
        </div>
      )}
    </MainLayout>
  );
}
