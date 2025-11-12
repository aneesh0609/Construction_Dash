// pages/features.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} from "../redux/slices/featureSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { X } from "lucide-react";

export default function FeaturesAdminPage() {
  const dispatch = useDispatch();
  const { features = [], loading } = useSelector(
    (s) => s.features || { features: [], loading: false }
  );

  const [mode, setMode] = useState("list");
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchFeatures());
  }, [dispatch]);

  const resetForm = () => {
    setForm({ title: "", description: "" });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim())
      return toast.error("All fields are required");

    const res = await dispatch(createFeature(form));
    if (res.type?.includes("fulfilled")) {
      resetForm();
      setMode("list");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({ title: item.title || "", description: item.description || "" });
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return toast.error("No feature selected");
    const res = await dispatch(updateFeature({ id: editingId, payload: form }));
    if (res.type?.includes("fulfilled")) {
      resetForm();
      setMode("list");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteFeature(deleteTarget._id));
    setDeleteTarget(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
    
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Features Management
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Add, edit, and manage all platform features efficiently.
          </p>
        </header>

        {/* Mode Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("list");
                resetForm();
              }}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 shadow ${
                mode === "list"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              List ({features.length})
            </button>

            <button
              onClick={() => {
                setMode("create");
                resetForm();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 shadow ${
                mode === "create"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Create
            </button>
          </div>
        </div>

       
        {(mode === "create" || mode === "edit") && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              {mode === "create" ? "Add New Feature" : "Edit Feature"}
            </h2>

            <form
              onSubmit={mode === "create" ? handleCreate : handleUpdate}
              className="grid gap-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Feature Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Fast Delivery"
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write a short description..."
                  className="w-full border border-slate-200 p-3 rounded-xl min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-all"
                >
                  {mode === "create" ? "Create Feature" : "Update Feature"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all"
                  onClick={() => {
                    resetForm();
                    setMode("list");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.section>
        )}

     
        {mode === "list" && (
          <section>
            {loading ? (
              <div className="text-center p-10 text-slate-600">Loading...</div>
            ) : features.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow border border-slate-100">
                <p className="text-slate-600 font-medium">
                  No features available
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Add a new feature using the Create button above
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f) => (
                  <motion.article
                    key={f._id}
                    whileHover={{ y: -6 }}
                    className="group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 p-6 flex flex-col justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {f.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-4">
                        {f.description}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(f)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-blue-100 text-blue-600 transition-all"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(f)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-rose-600 transition-all"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        )}

        
        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
              >
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  Delete Feature
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-rose-600">
                    “{deleteTarget.title}”
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
