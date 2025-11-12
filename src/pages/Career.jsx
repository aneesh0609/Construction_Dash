import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplications,
  deleteApplication,
} from "../redux/slices/careerSlice";
import {
  Download,
  Trash2,
  Loader2,
  FileText,
  Inbox,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function CareerApplications() {
  const dispatch = useDispatch();
  const { applications = [], loading } = useSelector(
    (state) => state.careers || {}
  );

  const [downloadingId, setDownloadingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    document.title = "Career Applications | Admin Dashboard";
    dispatch(fetchApplications());
  }, [dispatch]);

  // ✅ Download Resume Function
  const handleDownload = async (url, fileName) => {
    try {
      setDownloadingId(fileName);
      const response = await fetch(url);
      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadingId(null);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download resume. Please try again.");
      setDownloadingId(null);
    }
  };

  // ✅ Handle Delete Confirm
  const confirmDelete = (id) => {
    setDeleteModal({ open: true, id });
  };

  const handleDelete = () => {
    if (deleteModal.id) {
      dispatch(deleteApplication(deleteModal.id));
      setDeleteModal({ open: false, id: null });
    }
  };

  const closeModal = () => setDeleteModal({ open: false, id: null });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Career Applications
          </h1>
          <div className="flex items-center gap-3 bg-white shadow-sm border border-orange-100 px-5 py-2 rounded-xl">
            <FileText className="text-orange-500" size={20} />
            <p className="text-slate-700 font-medium">
              Total:{" "}
              <span className="text-orange-600 font-semibold">
                {applications.length}
              </span>
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-24">
            <Loader2 className="animate-spin text-orange-600 mb-3" size={40} />
            <p className="text-slate-600 text-lg">Loading applications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-orange-100 p-6 rounded-full mb-4">
              <Inbox className="text-orange-500" size={40} />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">
              No Applications Found
            </h3>
            <p className="text-slate-500 max-w-md">
              When candidates submit job applications from your career page,
              they’ll appear here for easy review and management.
            </p>
          </div>
        )}

        {/* Applications Grid */}
        {!loading && applications.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border border-orange-100 hover:border-orange-200 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {app.fullName}
                </h3>
                <p className="text-orange-600 font-medium mb-4">
                  {app.jobTitle || "General Application"}
                </p>

                <div className="text-sm text-slate-700 space-y-1 mb-5">
                  <p>
                    <span className="font-semibold">Email:</span> {app.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {app.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {app.location}
                  </p>
                  <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {app.experience}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                  {app.resumeUrl ? (
                    <button
                      onClick={() =>
                        handleDownload(
                          app.resumeUrl,
                          `${app.fullName.replace(/\s+/g, "_")}_resume.pdf`
                        )
                      }
                      className="text-orange-600 font-semibold flex items-center gap-2 hover:underline transition-all"
                      disabled={downloadingId === app._id}
                    >
                      {downloadingId === app._id ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin text-orange-500"
                          />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download size={16} /> Resume
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-slate-400 text-sm italic">
                      No resume uploaded
                    </span>
                  )}

                  <button
                    onClick={() => confirmDelete(app._id)}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <XCircle size={24} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <AlertTriangle className="text-red-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Delete Application?
              </h3>
              <p className="text-slate-600">
                Are you sure you want to permanently delete this candidate’s
                application? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={closeModal}
                className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
