const PostTitleInput = ({ title, setTitle }) => {
  return (
    <div className="space-y-1">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={300}
        required
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <div className="text-xs text-muted-foreground text-right">
        {title.length}/300
      </div>
    </div>
  );
};

export default PostTitleInput;
