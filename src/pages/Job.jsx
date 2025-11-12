import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../redux/slices/jobSlice";
import {
  MapPin,
  Clock,
  DollarSign,
  PlusCircle,
  Trash2,
  Edit3,
  Loader2,
  ChevronLeft,
  Save,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminJobDashboard() {
  const dispatch = useDispatch();
  const { jobs = [], loading = false } = useSelector((state) => state.jobs || {});

  const [mode, setMode] = useState("view"); // "view" | "create"
  const [editJob, setEditJob] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "",
    salary: "",
    description: "",
  });

  /* -------------------------
     Fetch all jobs on load
  -------------------------- */
  useEffect(() => {
    document.title = "Admin - Manage Careers";
    dispatch(fetchJobs());
  }, [dispatch]);

  /* -------------------------
     Handle Input Change
  -------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* -------------------------
     Reset Form
  -------------------------- */
  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      type: "",
      salary: "",
      description: "",
    });
    setEditJob(null);
    setMode("view");
  };

  /* -------------------------
     Handle Submit
  -------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = { ...formData };

    try {
      if (editJob) {
        await dispatch(updateJob({ id: editJob._id, formData: payload }));
        toast.success("Job updated successfully!");
      } else {
        await dispatch(createJob(payload));
        toast.success("New job added!");
      }
      resetForm();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  /* -------------------------
     Handle Delete
  -------------------------- */
  const confirmDelete = async () => {
    try {
      await dispatch(deleteJob(deleteModal.id));
      toast.success("Job deleted successfully!");
      setDeleteModal({ show: false, id: null });
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  /* -------------------------
     Start Editing
  -------------------------- */
  const startEdit = (job) => {
    setEditJob(job);
    setFormData({
      title: job.title,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
    });
    setMode("create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <h1 className="text-3xl font-bold text-slate-900 text-center sm:text-left">
            {mode === "view" ? "Manage Job Openings" : "Create / Edit Job"}
          </h1>

          <button
            onClick={() => setMode(mode === "view" ? "create" : "view")}
            className="flex items-center justify-center gap-2 px-5 py-3 w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            {mode === "view" ? (
              <>
                <PlusCircle size={20} /> Add New Job
              </>
            ) : (
              <>
                <ChevronLeft size={20} /> Back to Jobs
              </>
            )}
          </button>
        </div>

        {/* -----------------------
            VIEW ALL JOBS SECTION
        ------------------------ */}
        {mode === "view" && (
          <>
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="animate-spin text-orange-600" size={36} />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-24 text-slate-600 text-lg">
                No jobs found. Click “Add New Job” to create one.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-orange-100 transition-all"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>

                    <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} className="text-orange-500" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} className="text-orange-500" /> {job.type}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} className="text-orange-500" /> {job.salary}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 mb-4">
                      {job.description?.slice(0, 120)}...
                    </p>

                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <button
                        onClick={() => startEdit(job)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
                      >
                        <Edit3 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, id: job._id })}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* -----------------------
            CREATE / EDIT JOB FORM
        ------------------------ */}
        {mode === "create" && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editJob ? "Update Job Details" : "Create New Job"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="$70k - $100k"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Save size={18} /> {editJob ? "Update Job" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* -----------------------
          DELETE MODAL
      ------------------------ */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="text-orange-500 mb-3" size={40} />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Confirm Deletion
              </h2>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this job? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4 w-full">
                <button
                  onClick={() => setDeleteModal({ show: false, id: null })}
                  className="px-5 py-2 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
