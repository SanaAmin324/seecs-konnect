import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Pages */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/Notfound";

/* Auth */
import ProtectedRoute from "./components/ProtectedRoute";

/* Documents */
import Documents from "./pages/Document/Documents";
import { DocumentUploadProvider } from "@/context/DocumentUploadContext";
import UploadDocument from "@/pages/Document/UploadDocument";
import DocumentInfo from "@/pages/Document/DocumentInfo";
import DocumentReview from "@/pages/Document/DocumentReview";

/* Forum */
import Forum from "./pages/Forum/Forum";
import ForumPost from "./pages/Forum/ForumPost";
import CreatePost from "./pages/Forum/CreatePost";

/* User */
import UserProfile from "@/pages/UserProfile";
import Settings from "@/pages/Settings";
import Connections from "@/pages/Connections";
import Notifications from "@/pages/Notifications";
import Messages from "@/pages/Messages";
import Search from "@/pages/Search";

/* Admin */
import ReportsDashboard from "./pages/Admin/ReportsDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===================== */}
        {/* Public Routes */}
        {/* ===================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notfound" element={<NotFound />} />

        {/* ===================== */}
        {/* Forum Routes (Public) */}
        {/* ===================== */}
        <Route path="/forums" element={<Forum />} />
        <Route path="/forums/create" element={<CreatePost />} />
        <Route path="/forums/:postId" element={<ForumPost />} />

        {/* ===================== */}
        {/* User Profile (Protected) */}
        {/* ===================== */}
        <Route
          path="/u/:username"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/connections"
          element={
            <ProtectedRoute>
              <Connections />
            </ProtectedRoute>
          }
        />

        <Route
          path="/connections/:userId"
          element={
            <ProtectedRoute>
              <Connections />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        {/* ===================== */}
        {/* Dashboard */}
        {/* ===================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ===================== */}
        {/* Documents */}
        {/* ===================== */}
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
          path="/documents/review"
          element={
            <DocumentUploadProvider>
              <DocumentReview />
            </DocumentUploadProvider>
          }
        />

        {/* ===================== */}
        {/* Admin Routes */}
        {/* ===================== */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requireAdmin={true}>
              <ReportsDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===================== */}
        {/* Fallback */}
        {/* ===================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
