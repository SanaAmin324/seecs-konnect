import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock } from "lucide-react";
import { formatTimeAgo } from "@/lib/timeUtils";
import { COURSE_LIST } from "@/lib/courses";

export default function RecentDocumentsCard() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/documents/recent")
      .then((res) => res.json())
      .then((data) => {
        setDocs(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getCourseInfo = (courseCode) => {
    return COURSE_LIST.find(course => course.code === courseCode) || { name: courseCode };
  };

  const handleDocumentClick = (docId) => {
    navigate(`/documents/view/${docId}`);
  };

  if (loading) {
    return (
      <div className="bg-card border rounded-xl p-5 h-fit">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Recently Uploaded Documents
        </h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl p-5 h-fit">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Recently Uploaded Documents
      </h2>

      {docs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recent documents</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {docs.slice(0, 5).map((doc) => {
            const courseInfo = getCourseInfo(doc.course);
            return (
              <li 
                key={doc._id} 
                className="cursor-pointer hover:bg-muted/50 rounded-lg p-3 -mx-3 transition-colors"
                onClick={() => handleDocumentClick(doc._id)}
              >
                <div className="space-y-1">
                  <p className="font-medium text-sm hover:text-primary transition-colors">
                    {doc.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {courseInfo.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(doc.createdAt)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {docs.length > 0 && (
        <div className="mt-4 pt-3 border-t">
          <button 
            onClick={() => navigate('/documents')}
            className="text-xs text-primary hover:underline"
          >
            View all documents →
          </button>
        </div>
      )}
    </div>
  );
}
