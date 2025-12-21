import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { AlertCircle, CheckCircle, Clock, Eye, Trash2, MessageSquare } from "lucide-react";

const ReportsDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending"); // pending, reviewed, resolved, dismissed
  const [selectedReport, setSelectedReport] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded.role !== "admin") {
        navigate("/forums");
      }
    } catch (err) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch reports
  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const query = filterStatus ? `?status=${filterStatus}` : "";
      const res = await fetch(`http://localhost:5000/api/reports/${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReports(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus, notes) => {
    try {
      setUpdating(true);
      const res = await fetch(
        `http://localhost:5000/api/reports/${reportId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus, notes }),
        }
      );
      if (!res.ok) throw new Error("Failed to update report");
      
      // Refresh reports
      fetchReports();
      setSelectedReport(null);
      alert("Report updated successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "dismissed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "reviewed":
        return <Eye size={16} />;
      case "resolved":
        return <CheckCircle size={16} />;
      case "dismissed":
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reports Dashboard</h1>
          <p className="text-gray-600">Manage reported forum posts</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["pending", "reviewed", "resolved", "dismissed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
              {filterStatus === status && reports.length > 0 && (
                <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-sm">
                  {reports.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8 text-gray-600">Loading reports...</div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
          )}

          {!loading && reports.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No {filterStatus} reports found
            </div>
          )}

          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Report Info */}
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusIcon(report.status)}
                      {report.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Reported By */}
                  <div className="text-sm mb-2">
                    <span className="font-medium">Reported by:</span>{" "}
                    <span className="text-gray-700">{report.reportedBy?.name}</span>
                    <span className="text-gray-500 ml-2">
                      ({report.reportedBy?.email})
                    </span>
                  </div>

                  {/* Reason */}
                  <div className="text-sm mb-2">
                    <span className="font-medium">Reason:</span>{" "}
                    <span className="capitalize bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                      {report.reason}
                    </span>
                  </div>

                  {/* Description */}
                  {report.description && (
                    <div className="text-sm mb-2">
                      <span className="font-medium">Description:</span>
                      <p className="text-gray-700 mt-1 italic">
                        "{report.description}"
                      </p>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="bg-gray-50 p-3 rounded mb-2 text-sm">
                    <span className="font-medium text-gray-900">Post Content:</span>
                    <p className="text-gray-700 mt-1 break-words">
                      {report.post?.content?.substring(0, 200)}
                      {report.post?.content?.length > 200 ? "..." : ""}
                    </p>
                  </div>

                  {/* Admin Notes */}
                  {report.notes && (
                    <div className="bg-blue-50 p-3 rounded text-sm">
                      <span className="font-medium text-blue-900">Admin Notes:</span>
                      <p className="text-blue-800 mt-1">{report.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1 whitespace-nowrap"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/forums/${report.post?._id}`)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center gap-1 whitespace-nowrap"
                  >
                    <MessageSquare size={16} />
                    Post
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-medium">Current Status:</span>
                  <p className={`mt-1 px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </p>
                </div>

                <div>
                  <span className="font-medium">Reported By:</span>
                  <p className="text-gray-700 mt-1">
                    {selectedReport.reportedBy?.name} ({selectedReport.reportedBy?.email})
                  </p>
                </div>

                <div>
                  <span className="font-medium">Reason:</span>
                  <p className="capitalize mt-1">{selectedReport.reason}</p>
                </div>

                {selectedReport.description && (
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-gray-700 mt-1">{selectedReport.description}</p>
                  </div>
                )}

                <div>
                  <span className="font-medium">Post Content:</span>
                  <p className="bg-gray-50 p-3 rounded mt-1 text-gray-700">
                    {selectedReport.post?.content}
                  </p>
                </div>

                <div>
                  <span className="font-medium">Admin Notes:</span>
                  <textarea
                    defaultValue={selectedReport.notes || ""}
                    placeholder="Add notes about this report..."
                    className="w-full mt-1 p-2 border rounded text-sm"
                    rows="3"
                    id="reportNotes"
                  />
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-2 border-t pt-4">
                <p className="font-medium mb-2">Update Status:</p>
                <div className="grid grid-cols-2 gap-2">
                  {["reviewed", "resolved", "dismissed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        const notes = document.getElementById("reportNotes").value;
                        handleUpdateStatus(selectedReport._id, status, notes);
                      }}
                      disabled={updating}
                      className={`px-4 py-2 rounded font-medium transition capitalize ${
                        selectedReport.status === status
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ReportsDashboard;
