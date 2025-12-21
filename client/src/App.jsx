import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/Notfound";
import Documents from "./pages/Document/Documents";
import { DocumentUploadProvider } from "@/context/DocumentUploadContext";
// Correct imports example
import UploadDocument from "@/pages/Document/UploadDocument";
import DocumentInfo from "@/pages/Document/DocumentInfo";
import DocumentCategory from "@/pages/Document/DocumentCategory";
import DocumentReview from "@/pages/Document/DocumentReview";
import Forum from "./pages/Forum/Forum";
import ForumPost from "./pages/Forum/ForumPost";
import CreatePost from "./pages/Forum/CreatePost";
import ReportsDashboard from "./pages/Admin/ReportsDashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notfound" element={<NotFound />} />
         {/* 👉 FORUM ROUTE */}
         <Route path="/forums" element={<Forum />} />
<Route path="/forums/:postId" element={<ForumPost />} />
<Route path="/forums/create" element={<CreatePost />} />



        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/upload"
          element={
            <DocumentUploadProvider>
              <UploadDocument />
            </DocumentUploadProvider>
          }
        />

        <Route
          path="/documents/info"
          element={
            <DocumentUploadProvider>
              <DocumentInfo />
            </DocumentUploadProvider>
          }
        />

        <Route
          path="/documents/category"
          element={
            <DocumentUploadProvider>
              <DocumentCategory />
            </DocumentUploadProvider>
          }
        />

        <Route
          path="/documents/review"
          element={
            <DocumentUploadProvider>
              <DocumentReview />
            </DocumentUploadProvider>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requireAdmin={true}>
              <ReportsDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  );
}
