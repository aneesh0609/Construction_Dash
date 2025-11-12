// pages/contact.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../redux/slices/contactSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function ContactPage() {
  const dispatch = useDispatch();
  const { inquiries = [], loading } = useSelector((state) => state.contact);
  const [filter, setFilter] = useState("all");
  const [viewInquiry, setViewInquiry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchInquiries());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateInquiryStatus({ id, status }))
      .unwrap()
      .then(() => toast.success("Status updated successfully"))
      .catch((err) => toast.error(err));
  };

  const filteredInquiries =
    filter === "pending"
      ? inquiries.filter((inq) => !inq.status || inq.status === "Pending")
      : inquiries;

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    dispatch(deleteInquiry(deleteTarget._id))
      .unwrap()
      .then(() => toast.success("Inquiry deleted successfully"))
      .catch((err) => toast.error(err))
      .finally(() => setDeleteTarget(null));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
  
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Inquiries Management
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Manage and respond to customer inquiries efficiently.
          </p>
        </header>

 
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 shadow ${
                filter === "all"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              All Inquiries
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 shadow ${
                filter === "pending"
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Pending Only
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center text-slate-600 p-10">
            Loading inquiries...
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-slate-100">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">Subject</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-6 text-center text-slate-500 font-medium"
                    >
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq, i) => (
                    <tr
                      key={inq._id}
                      className="border-b hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {inq.name}
                      </td>
                      <td className="px-4 py-3">{inq.email}</td>
                      <td className="px-4 py-3">{inq.phone || "-"}</td>
                      <td className="px-4 py-3">{inq.subject || "-"}</td>
                      <td
                        className="px-4 py-3 max-w-xs truncate text-blue-600 cursor-pointer"
                        onClick={() => setViewInquiry(inq)}
                        title="Click to view full message"
                      >
                        {inq.message?.slice(0, 60)}...
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={inq.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(inq._id, e.target.value)
                          }
                          className={`border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 ${
                            inq.status === "Replied"
                              ? "bg-green-100 text-green-800"
                              : inq.status === "Seen"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Seen">Seen</option>
                          <option value="Replied">Replied</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setDeleteTarget(inq)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MESSAGE VIEW MODAL */}
        <AnimatePresence>
          {viewInquiry && (
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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative"
              >
                <button
                  onClick={() => setViewInquiry(null)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  Inquiry Details
                </h2>

                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-slate-700">Name:</span>{" "}
                    {viewInquiry.name}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Email:</span>{" "}
                    {viewInquiry.email}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Phone:</span>{" "}
                    {viewInquiry.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">
                      Subject:
                    </span>{" "}
                    {viewInquiry.subject || "-"}
                  </p>
                  <div className="mt-4">
                    <h3 className="text-slate-700 font-semibold mb-1">
                      Message:
                    </h3>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {viewInquiry.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setViewInquiry(null)}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DELETE CONFIRMATION MODAL */}
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
                  Delete Inquiry
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Are you sure you want to delete inquiry from{" "}
                  <span className="font-medium text-rose-600">
                    “{deleteTarget.name}”
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
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
