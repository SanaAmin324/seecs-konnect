import { useState } from "react";
import { X, Copy, Mail, MessageCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShareModal = ({ postId, postTitle, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const postUrl = `${window.location.origin}/forums/${postId}`;
  const shareText = `Check out this post: "${postTitle}" on SEECS Konnect`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
      alert("Failed to copy link");
    }
  };

  const handleShareVia = (method) => {
    let url = "";
    switch (method) {
      case "email":
        url = `mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(shareText + "\n\n" + postUrl)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + postUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOptions = [
    {
      id: "copy",
      icon: Copy,
      label: "Copy Link",
      color: "hover:bg-primary/10",
      action: handleCopyLink,
    },
    {
      id: "email",
      icon: Mail,
      label: "Share via Email",
      color: "hover:bg-blue-500/10",
      action: () => handleShareVia("email"),
    },
    {
      id: "whatsapp",
      icon: MessageCircle,
      label: "Share on WhatsApp",
      color: "hover:bg-green-500/10",
      action: () => handleShareVia("whatsapp"),
    },
    {
      id: "twitter",
      label: "Share on Twitter",
      color: "hover:bg-blue-400/10",
      action: () => handleShareVia("twitter"),
      customIcon: "𝕏",
    },
    {
      id: "facebook",
      label: "Share on Facebook",
      color: "hover:bg-blue-600/10",
      action: () => handleShareVia("facebook"),
      customIcon: "f",
    },
    {
      id: "linkedin",
      label: "Share on LinkedIn",
      color: "hover:bg-blue-700/10",
      action: () => handleShareVia("linkedin"),
      customIcon: "in",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Share This Post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Share Options Grid */}
        <div className="p-6 space-y-3">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.action}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border border-border/50 transition-all duration-200 ${option.color} hover:border-border group`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                {option.customIcon ? (
                  <span className="text-sm font-bold text-primary">{option.customIcon}</span>
                ) : (
                  <option.icon size={20} className="text-primary" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground text-sm">{option.label}</p>
              </div>
              {option.id === "copy" && copied && (
                <span className="text-xs font-semibold text-green-500">Copied!</span>
              )}
            </button>
          ))}
        </div>

        {/* Link Display */}
        <div className="px-6 pb-6">
          <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
            <LinkIcon size={16} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={postUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              {copied ? "✓" : "Copy"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full rounded-lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
