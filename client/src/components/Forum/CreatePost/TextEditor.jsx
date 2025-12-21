import { useRef, useEffect } from "react";

const TextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  // Sync external value changes to the DOM
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const format = (command) => {
    editorRef.current?.focus();
    document.execCommand(command);
  };

  const handleInput = (e) => {
    onChange(e.currentTarget.innerHTML);
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
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        onInput={handleInput}
        className="
          min-h-[180px]
          p-3
          text-sm
          focus:outline-none
          prose prose-sm max-w-none
        "
        style={{ direction: 'ltr', textAlign: 'left' }}
      >
        Write your post...
      </div>
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
