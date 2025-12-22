import { useState, useEffect } from "react";
import { FileText, Download } from "lucide-react";

const ProfileFavourites = ({ user }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteDocuments = async () => {
      try {
        const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/documents/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        }
      } catch (error) {
        console.error("Error fetching favorite documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteDocuments();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">Loading favorite documents...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-xl border p-6 text-center">
          <p className="text-muted-foreground">No favorite documents yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div key={doc._id} className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-card-foreground">{doc.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {doc.course} • {doc.category || "Document"}
              </p>
              {doc.description && (
                <p className="text-sm text-muted-foreground mt-2">{doc.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>Uploaded by {doc.uploader?.name}</span>
                {doc.files && doc.files.length > 0 && (
                  <span>• {doc.files.length} file(s)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileFavourites;
