import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

const DocumentViewer = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5000/api/documents/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setDoc);
  }, [id]);

  if (!doc) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold">{doc.title}</h1>
      <p className="text-sm text-muted-foreground">
        {doc.pages} pages • Uploaded by {doc.uploader.name}
      </p>

      <div className="mt-6 border rounded-lg p-4 bg-white">
        <Document file={doc.fileUrl}>
          <Page pageNumber={pageNumber} />
        </Document>

        <div className="flex justify-between mt-4">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
          >
            Previous
          </button>

          <span>
            Page {pageNumber} of {doc.pages}
          </span>

          <button
            disabled={pageNumber >= doc.pages}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
