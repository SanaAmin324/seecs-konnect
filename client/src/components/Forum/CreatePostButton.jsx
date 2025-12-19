import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreatePostButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/forums/create")}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 
                 bg-primary text-white px-5 py-3 rounded-full shadow-lg
                 hover:bg-primary/90 transition"
    >
      <Plus className="w-5 h-5" />
      Create Post
    </button>
  );
};

export default CreatePostButton;
