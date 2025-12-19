import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PostTypeTabs from "@/components/Forum/CreatePost/PostTypeTabs";
import PostTitleInput from "@/components/Forum/CreatePost/PostTitleInput";
import TextEditor from "@/components/Forum/CreatePost/TextEditor";
import MediaUploader from "@/components/Forum/CreatePost/MediaUploader";
import LinkInput from "@/components/Forum/CreatePost/LinkInput";
import DraftsMenu from "@/components/Forum/CreatePost/DraftsMenu";
import CreatePostActions from "@/components/Forum/CreatePost/CreatePostActions";

const CreatePostForm = () => {
  const navigate = useNavigate();

  const [postType, setPostType] = useState("text");
  const [title, setTitle] = useState("");

  const [textBody, setTextBody] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [linkUrl, setLinkUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------------------- VALIDATION -------------------- */
  const canSubmit =
    title.trim().length > 0 &&
    (
      (postType === "text" && textBody.trim().length > 0) ||
      (postType === "image" && mediaFiles.length > 0) ||
      (postType === "video" && mediaFiles.length > 0) ||
      (postType === "link" && linkUrl.trim().length > 0)
    );

  /* -------------------- DRAFT HANDLING -------------------- */
  const handleSaveDraft = () => {
    const draft = {
      id: Date.now(),
      postType,
      title,
      textBody,
      mediaFiles: [], // ⚠️ files themselves shouldn’t be stored
      linkUrl,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`draft-${draft.id}`, JSON.stringify(draft));
    alert("Draft saved");
  };

  const handleLoadDraft = (draft) => {
    setPostType(draft.postType);
    setTitle(draft.title || "");
    setTextBody(draft.textBody || "");
    setLinkUrl(draft.linkUrl || "");
    setMediaFiles([]); // files must be re-added manually
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    const postPayload = {
      type: postType,
      title,
      content: postType === "text" ? textBody : null,
      linkUrl: postType === "link" ? linkUrl : null,
      media: mediaFiles
    };

    console.log("POST PAYLOAD:", postPayload);

    // TODO: replace with API call
    // await createPost(postPayload);

    setIsSubmitting(false);
    navigate("/forums");
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

      {/* Title */}
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
