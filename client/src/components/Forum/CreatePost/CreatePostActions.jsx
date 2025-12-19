const CreatePostActions = ({
  onSaveDraft,
  onSubmit,
  isSubmitting,
  canSubmit
}) => {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={onSaveDraft}
        className="px-4 py-2 border rounded-md text-sm hover:bg-muted transition"
      >
        Save Draft
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting}
        className={`px-6 py-2 rounded-md text-sm text-white transition
          ${canSubmit
            ? "bg-primary hover:bg-primary/90"
            : "bg-muted cursor-not-allowed"}`}
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default CreatePostActions;
