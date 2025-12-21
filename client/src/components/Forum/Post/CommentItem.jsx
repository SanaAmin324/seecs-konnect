import { useState } from "react";

const CommentItem = ({
  comment,
  isNew = false,
  onSubmit,
  onReplySubmit,
}) => {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");

  /* NEW COMMENT INPUT */
  if (isNew) {
    return (
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-muted rounded-full" />
        <div className="flex-1">
          <textarea
            placeholder="Add a comment..."
            className="w-full border border-border rounded-lg p-2 text-sm bg-input text-foreground"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                onSubmit(text);
                setText("");
              }}
              className="bg-primary text-primary-foreground px-4 py-1 rounded text-sm"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Comment */}
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-muted rounded-full" />

        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-sm font-medium text-foreground">
              {comment.author}
              <span className="text-xs text-muted-foreground ml-2">
                {comment.time}
              </span>
            </div>
            <p className="text-sm mt-1 text-foreground">{comment.text}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 text-xs text-muted-foreground mt-1 ml-2">
            <button className="hover:underline">Like</button>
            <button
              onClick={() => setReplying(!replying)}
              className="hover:underline"
            >
              Reply
            </button>
          </div>

          {/* Reply input */}
          {replying && (
            <div className="mt-2 ml-6">
              <textarea
                placeholder="Write a reply..."
                className="w-full border border-border rounded-lg p-2 text-sm bg-input text-foreground"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => setReplying(false)}
                  className="text-xs text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onReplySubmit(comment.id, text);
                    setText("");
                    setReplying(false);
                  }}
                  className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs"
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔁 RECURSIVE REPLIES */}
      {comment.replies.length > 0 && (
        <div className="ml-10 space-y-3 border-l pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
