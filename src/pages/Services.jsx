// pages/services.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../redux/slices/serviceSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { BiEdit } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import { X } from "lucide-react";

export default function ServicesAdminPage() {
  const dispatch = useDispatch();
  const { services = [], loading } = useSelector(
    (s) => s.services || { services: [], loading: false }
  );

  const [mode, setMode] = useState("list"); // list | create | edit
  const [form, setForm] = useState({
    title: "",
    description: "",
    iconFile: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // For modal delete confirmation

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const resetForm = () => {
    setForm({ title: "", description: "", iconFile: null });
    setEditingId(null);
  };

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    if (name === "icon") setForm((p) => ({ ...p, iconFile: files?.[0] || null }));
    else setForm((p) => ({ ...p, [name]: value }));
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim())
      return toast.error("Title and description required");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (form.iconFile) fd.append("icon", form.iconFile);

    const res = await dispatch(createService(fd));
    if (res.type?.includes("fulfilled")) {
      resetForm();
      setMode("list");
    }
  };

  const startEdit = (svc) => {
    setEditingId(svc._id);
    setForm({
      title: svc.title || "",
      description: svc.description || "",
      iconFile: null,
    });
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return toast.error("No service selected");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (form.iconFile) fd.append("icon", form.iconFile);

    const res = await dispatch(updateService({ id: editingId, formData: fd }));
    if (res.type?.includes("fulfilled")) {
      resetForm();
      setMode("list");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteService(deleteTarget._id));
    setDeleteTarget(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
       
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Services Management
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Create, edit, and manage your platform’s services.
          </p>
        </header>

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
              List ({services.length})
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

        {/* FORM */}
        {(mode === "create" || mode === "edit") && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              {mode === "create" ? "Add New Service" : "Edit Service"}
            </h2>

            <form
              onSubmit={mode === "create" ? submitCreate : submitEdit}
              className="grid gap-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Service Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInput}
                    placeholder="e.g. Home Construction"
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Icon (optional)
                  </label>
                  <input
                    name="icon"
                    type="file"
                    accept="image/*"
                    onChange={handleInput}
                    className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50"
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
                  onChange={handleInput}
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
                  {mode === "create" ? "Create Service" : "Update Service"}
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
            ) : services.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow border border-slate-100">
                <p className="text-slate-600 font-medium">No services available</p>
                <p className="text-slate-400 text-sm mt-1">
                  Add your first service using the Create button above
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (
                  <motion.article
                    key={s._id}
                    whileHover={{ y: -6 }}
                    className="group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 p-6 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner">
                        {s.icon ? (
                          <img
                            src={s.icon}
                            alt={s.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-slate-400 text-sm">No Icon</div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {s.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-3">
                          {s.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Created: {new Date(s.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(s)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-blue-100 text-blue-600 transition-all"
                          title="Edit"
                        >
                          <BiEdit size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(s)}
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
                  Delete Service
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
