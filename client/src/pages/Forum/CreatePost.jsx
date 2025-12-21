import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import CreatePostForm from "../../components/Forum/CreatePostForm";

const CreatePost = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT / MAIN */}
        <div className="lg:col-span-3 bg-card p-6 rounded-lg shadow">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-xl font-semibold mb-4">Create a Post</h1>

          <CreatePostForm />
        </div>

        {/* RIGHT SIDEBAR (EMPTY FOR NOW) */}
        <div className="hidden lg:block bg-card rounded-lg shadow p-4 text-sm text-muted-foreground">
          Future content here
        </div>

      </div>
    </div>
    </MainLayout>
  );
};

export default CreatePost;
