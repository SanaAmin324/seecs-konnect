const AddComment = () => {
  return (
    <div className="bg-white rounded-xl border p-4">
      <textarea
        placeholder="Add a comment..."
        className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
          Comment
        </button>
      </div>
    </div>
  );
};

export default AddComment;
