const CommentToolbar = () => {
  return (
    <div className="flex justify-between items-center text-sm text-muted-foreground">

      <select className="border rounded px-2 py-1">
        <option>Best</option>
        <option>Newest</option>
        <option>Oldest</option>
      </select>

      <input
        type="text"
        placeholder="Search comments"
        className="border rounded px-3 py-1 text-sm"
      />
    </div>
  );
};

export default CommentToolbar;
