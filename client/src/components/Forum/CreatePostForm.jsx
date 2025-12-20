import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import PostTypeTabs from "@/components/Forum/CreatePost/PostTypeTabs";
import PostTitleInput from "@/components/Forum/CreatePost/PostTitleInput";
import TextEditor from "@/components/Forum/CreatePost/TextEditor";
import MediaUploader from "@/components/Forum/CreatePost/MediaUploader";
import LinkInput from "@/components/Forum/CreatePost/LinkInput";
import DraftsMenu from "@/components/Forum/CreatePost/DraftsMenu";
import CreatePostActions from "@/components/Forum/CreatePost/CreatePostActions";

const CreatePostForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [navigate, location.pathname]);

  const [postType, setPostType] = useState("text");
  const [title, setTitle] = useState(""); // UI only (optional for future)
  const [textBody, setTextBody] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------------------- VALIDATION -------------------- */
  const canSubmit =
    (postType === "text" && textBody.trim().length > 0) ||
    ((postType === "image" || postType === "video") && mediaFiles.length > 0) ||
    (postType === "link" && linkUrl.trim().length > 0);

  /* -------------------- DRAFT HANDLING -------------------- */
  const handleSaveDraft = () => {
    const draft = {
      id: Date.now(),
      postType,
      title,
      textBody,
      linkUrl,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(`draft-${draft.id}`, JSON.stringify(draft));
    alert("Draft saved");
  };

  const handleLoadDraft = (draft) => {
    setPostType(draft.postType);
    setTitle(draft.title || "");
    setTextBody(draft.textBody || "");
    setLinkUrl(draft.linkUrl || "");
    setMediaFiles([]); // files must be re-selected
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!canSubmit) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Required backend field
      formData.append("content", textBody || "");

      // Media files
      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      // Links
      if (postType === "link" && linkUrl.trim()) {
        formData.append(
          "links",
          JSON.stringify([{ url: linkUrl }])
        );
      }

      const res = await fetch("http://localhost:5000/api/forum", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { state: { from: location.pathname } });
          return;
        }
        const err = await res.json();
        throw new Error(err.message || "Failed to create post");
      }

      navigate("/forums");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>

        <DraftsMenu onLoadDraft={handleLoadDraft} />
      </div>

      {/* Tabs */}
      <PostTypeTabs postType={postType} setPostType={setPostType} />

      {/* Title (UI only for now) */}
      <PostTitleInput title={title} setTitle={setTitle} />

      {/* Body */}
      {postType === "text" && (
        <TextEditor value={textBody} onChange={setTextBody} />
      )}

      {(postType === "image" || postType === "video") && (
        <MediaUploader files={mediaFiles} setFiles={setMediaFiles} />
      )}

      {postType === "link" && (
        <LinkInput value={linkUrl} onChange={setLinkUrl} />
      )}

      {/* Actions */}
      <CreatePostActions
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        canSubmit={canSubmit}
      />
    </div>
  );
};

export default CreatePostForm;
