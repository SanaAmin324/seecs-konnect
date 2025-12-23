import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export default function RecentDocumentsCard() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/documents/recent")
      .then((res) => res.json())
      .then(setDocs)
      .catch(() => {});
  }, []);

  return (
    <div className="bg-card border rounded-xl p-5">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Recent Documents
      </h2>

      <ul className="space-y-3">
        {docs.slice(0, 5).map((doc) => (
          <li key={doc._id} className="text-sm">
            <p className="font-medium">{doc.title}</p>
            <p className="text-muted-foreground">
              Uploaded by {doc.uploader?.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
