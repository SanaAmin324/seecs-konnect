import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { formatTimeAgo } from "@/lib/timeUtils";
import { COURSE_LIST } from "@/lib/courses";

const DocumentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const token = user?.token;
        
        console.log('Fetching document with ID:', id);
        console.log('Token exists:', !!token);
        
        if (!token) {
          throw new Error('Authentication required');
        }

        const res = await fetch(`http://localhost:5000/api/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Document fetch response status:', res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Document fetch error:', errorText);
          throw new Error(`Failed to fetch document: ${res.status} ${errorText}`);
        }

        const data = await res.json();
        console.log('Document data received:', data);
        setDoc(data);
        
        // Fetch PDF file as blob with auth headers
        if (data.files && data.files[0]) {
          try {
            const pdfRes = await fetch(`http://localhost:5000/api/documents/view/${id}/0`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!pdfRes.ok) {
              throw new Error(`Failed to fetch PDF: ${pdfRes.status}`);
            }
            
            const blob = await pdfRes.blob();
            const blobUrl = URL.createObjectURL(blob);
            console.log('PDF blob URL created:', blobUrl);
            setPdfUrl(blobUrl);
          } catch (blobErr) {
            console.error('Error fetching PDF blob:', blobErr);
            setError('Failed to load PDF file');
          }
        } else {
          console.warn('No files found in document data');
          setError('No PDF file found for this document');
        }
        
        // Add to recently viewed
        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewedDocuments") || "[]");
        const updated = [data, ...recentlyViewed.filter(d => d._id !== data._id)].slice(0, 10);
        localStorage.setItem("recentlyViewedDocuments", JSON.stringify(updated));
      } catch (err) {
        console.error("Error fetching document:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    } else {
      setError('No document ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleDownload = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = user?.token;
      
      const res = await fetch(`http://localhost:5000/api/documents/download/${id}/0`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Download failed: ${errorText}`);
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.files?.[0]?.originalName || `${doc.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert(`Failed to download file: ${err.message}`);
    }
  };

  const getCourseInfo = (courseCode) => {
    return COURSE_LIST.find(course => course.code === courseCode) || { name: courseCode };
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-muted/40 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-muted/40 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-destructive mb-4">Failed to load document</p>
              <p className="text-muted-foreground mb-4 text-sm">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                  Try Again
                </Button>
                <Button onClick={() => navigate("/documents")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!doc) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-muted/40 flex items-center justify-center">
          <p>Document not found</p>
        </div>
      </MainLayout>
    );
  }

  const courseInfo = getCourseInfo(doc.course);

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/40 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/documents")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
            
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{doc.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">
                        {courseInfo.name}
                      </Badge>
                      <span>•</span>
                      <span>Uploaded {formatTimeAgo(doc.createdAt)}</span>
                      <span>•</span>
                      <span>by {doc.uploader?.name}</span>
                    </div>
                  </div>
                  <Button onClick={handleDownload} className="shrink-0">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Document Viewer */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                {pdfUrl ? (
                  <div className="w-full">
                    {/* Simple iframe PDF viewer */}
                    <div className="w-full">
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">
                          Viewing PDF with integrated viewer. Use the controls in the viewer toolbar.
                        </p>
                      </div>
                      <iframe
                        src={pdfUrl}
                        className="w-full border rounded-lg"
                        style={{ height: "700px" }}
                        title="PDF Viewer"
                      />
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <Button onClick={handleDownload}>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => window.open(pdfUrl, '_blank')}
                        >
                          Open in New Tab
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-4">No PDF file available for preview</p>
                    <Button onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download document
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentViewer;
