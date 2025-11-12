// pages/gallery.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../redux/slices/gallerySlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { X } from "lucide-react";

export default function GalleryPage() {
  const dispatch = useDispatch();
  const { gallery = [], loading } = useSelector((s) => s.gallery);

  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [preview, setPreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [mode, setMode] = useState("list"); // list | create
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    if (editId) {
      dispatch(updateGallery({ id: editId, formData: fd }))
        .then(() => {
          toast.success("Gallery updated successfully");
          resetForm();
          setMode("list");
        })
        .catch(() => toast.error("Failed to update gallery"));
    } else {
      dispatch(createGallery(fd))
        .then(() => {
          toast.success("Gallery item added");
          resetForm();
          setMode("list");
        })
        .catch(() => toast.error("Failed to add gallery item"));
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", image: null });
    setPreview("");
    setEditId(null);
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({ title: item.title, description: item.description, image: null });
    setPreview(item.imageUrl);
    setMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddImage = () => {
    // Toggle between list and create mode correctly
    if (mode === "list") {
      resetForm();
      setMode("create");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      resetForm();
      setMode("list");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteGallery(deleteTarget._id));
    toast.success("Gallery item deleted");
    setDeleteTarget(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
      
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Gallery Management
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Upload, edit, or delete gallery images easily.
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
              Gallery ({gallery.length})
            </button>

            <button
              onClick={handleAddImage}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 shadow ${
                mode === "create"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {mode === "create" ? "View Gallery" : "Add Image"}
            </button>
          </div>
        </div>

        {mode === "create" && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              {editId ? "Edit Gallery Item" : "Add New Image"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Home Design"
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50"
                    onChange={(e) => {
                      setForm({ ...form, image: e.target.files[0] });
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Write a short description..."
                  className="w-full border border-slate-200 p-3 rounded-xl min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-40 rounded-xl object-cover shadow-md"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-all"
                  type="submit"
                >
                  {editId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all"
                  onClick={resetForm}
                >
                  Clear
                </button>
              </div>
            </form>
          </motion.section>
        )}

      
        {mode === "list" && (
          <section>
            {loading ? (
              <div className="text-center p-10 text-slate-600">
                Loading gallery items...
              </div>
            ) : gallery.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow border border-slate-100">
                <p className="text-slate-600 font-medium">
                  No images in the gallery
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Add your first image using the “Add Image” button above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <motion.article
                    key={item._id}
                    whileHover={{ y: -6 }}
                    className="group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-56 w-full object-cover rounded-t-2xl"
                    />
                    <div className="p-5 flex flex-col justify-between">
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                        {item.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-blue-100 text-blue-600 transition-all"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-rose-600 transition-all"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
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
                  Delete Image
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
