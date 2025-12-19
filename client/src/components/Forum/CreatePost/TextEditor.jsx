import { useRef } from "react";

const TextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const format = (command) => {
    editorRef.current?.focus();
    document.execCommand(command);
  };

  return (
    <div className="border rounded-md bg-background">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b p-2 text-sm bg-muted/40">
        <EditorButton label="B" onClick={() => format("bold")} />
        <EditorButton label="I" onClick={() => format("italic")} />
        <EditorButton label="S" onClick={() => format("strikeThrough")} />
        <EditorButton label="•" onClick={() => format("insertUnorderedList")} />
        <EditorButton label="1." onClick={() => format("insertOrderedList")} />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        placeholder="Write your post..."
        className="
          min-h-[180px]
          p-3
          text-sm
          focus:outline-none
          prose prose-sm max-w-none
        "
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        suppressContentEditableWarning
      />
    </div>
  );
};

const EditorButton = ({ label, onClick }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()} // 🔑 CRITICAL FIX
    onClick={onClick}
    className="px-2 py-1 rounded hover:bg-muted transition"
  >
    {label}
  </button>
);

export default TextEditor;
