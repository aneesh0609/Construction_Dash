import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
  createProject,
  updateProject,
} from "../redux/slices/projectSlice";
import { toast } from "react-toastify";

export default function AdminProjectsPage() {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((s) => s.projects);

  const [mode, setMode] = useState("list"); // list | create | edit
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Residential",
    location: "",
    completionDate: "",
    featured: false,
    images: [],
  });
  const [editSlug, setEditSlug] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") setForm({ ...form, images: files });
    else setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "images") {
        for (let img of form.images) fd.append("images", img);
      } else fd.append(key, form[key]);
    });

    if (mode === "create") {
      const res = await dispatch(createProject(fd));
      if (res?.payload) {
        toast.success("Project created successfully");
        setMode("list");
        dispatch(fetchProjects());
      }
    }

    if (mode === "edit") {
      const res = await dispatch(updateProject({ slug: editSlug, formData: fd }));
      if (res?.payload) {
        toast.success("Project updated successfully");
        setMode("list");
        dispatch(fetchProjects());
      }
    }
  };

  const startEdit = (p) => {
    setEditSlug(p.slug);
    setForm({ ...p, images: [] });
    setMode("edit");
  };

  const handleDelete = async (slug) => {
    const res = await dispatch(deleteProject(slug));
    if (res?.payload?.success) toast.success("Project deleted");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
   
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Projects Management</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">Create, edit, and manage your portfolio projects</p>
          </div>
          
      
          <nav className="flex gap-3" role="tablist">
            <button
              onClick={() => setMode("list")}
              role="tab"
              aria-selected={mode === "list"}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                mode === "list"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white text-slate-700 hover:bg-slate-100 shadow-md"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">Project List</span>
              <span className="sm:hidden">List</span>
            </button>
            <button
              onClick={() => {
                setMode("create");
                setForm({ title: "", description: "", category: "Residential", location: "", completionDate: "", featured: false, images: [] });
              }}
              role="tab"
              aria-selected={mode === "create"}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                mode === "create"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white text-slate-700 hover:bg-slate-100 shadow-md"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create Project</span>
              <span className="sm:hidden">Create</span>
            </button>
          </nav>
        </header>

        
        {mode === "list" && (
          <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">All Projects</h2>
                  <p className="text-sm text-slate-600 mt-1">Total: {projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="text-blue-800 font-semibold">{projects.length}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium text-lg">No projects yet</p>
                  <p className="text-slate-400 text-sm mt-1">Click "Create Project" to add your first project</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6">
                  <div className="inline-block min-w-full align-middle px-6">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead>
                        <tr>
                          <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50 rounded-tl-lg">Title</th>
                          <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50 hidden md:table-cell">Category</th>
                          <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50 hidden lg:table-cell">Location</th>
                          <th scope="col" className="px-4 py-3.5 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {projects.map((p) => (
                          <tr key={p.slug} className="hover:bg-slate-50 transition-colors duration-150">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                                  {p.featured && (
                                    <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                      ⭐ Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                {p.category}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                              <div className="flex items-center text-sm text-slate-600">
                                <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {p.location}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => startEdit(p)} 
                                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-150"
                                  aria-label={`Edit ${p.title}`}
                                >
                                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(p.slug)} 
                                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-150"
                                  aria-label={`Delete ${p.title}`}
                                >
                                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

    
        {(mode === "create" || mode === "edit") && (
          <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {mode === "edit" ? (
                  <>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Project
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Project
                  </>
                )}
              </h2>
              <p className="text-sm text-slate-600 mt-1">Fill in the details below to {mode === "edit" ? "update" : "create"} your project</p>
            </div>

            <div className="p-6 space-y-6 max-w-3xl">
  
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter project title"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

          
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Enter project description"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none resize-none"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

           
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Enter location"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="completionDate" className="block text-sm font-semibold text-slate-700 mb-2">
                    Completion Date
                  </label>
                  <input
                    id="completionDate"
                    type="date"
                    name="completionDate"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    value={form.completionDate?.split("T")[0] || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

      
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white"
                >
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                  <option>Renovation</option>
                  <option>Road Construction</option>
                  <option>Other</option>
                </select>
              </div>

            
              <div className="flex items-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                <input
                  id="featured"
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500 border-amber-300"
                />
                <label htmlFor="featured" className="ml-3 flex items-center gap-2 text-sm font-semibold text-amber-900 cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Mark as Featured Project
                </label>
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="images" className="block text-sm font-semibold text-slate-700 mb-2">
                  Project Images
                </label>
                <div className="relative">
                  <input
                    id="images"
                    type="file"
                    multiple
                    name="images"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 focus:border-blue-500 transition-all duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 file:cursor-pointer"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">Upload multiple images for your project</p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {mode === "edit" ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Project
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Project
                    </>
                  )}
                </button>
                <button
                  onClick={() => setMode("list")}
                  className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}