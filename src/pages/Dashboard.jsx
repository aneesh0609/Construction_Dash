import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/slices/projectSlice";
import { fetchServices } from "../redux/slices/serviceSlice";
import { fetchFeatures } from "../redux/slices/featureSlice";
import { fetchInquiries } from "../redux/slices/contactSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { services } = useSelector((state) => state.services);
  const { features } = useSelector((state) => state.features);
  const { inquiries } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(fetchProjects()).catch((err) => toast.error(err));
    dispatch(fetchServices()).catch((err) => toast.error(err));
    dispatch(fetchFeatures()).catch((err) => toast.error(err));
    dispatch(fetchInquiries()).catch((err) => toast.error(err));
  }, [dispatch]);

  const recentInquiries = inquiries.slice(0, 5);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
    
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
          <p className="text-slate-600 text-sm sm:text-base">Monitor your platform's key metrics and recent activities</p>
        </header>

     
        <section aria-label="Statistics Overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
            <article className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-6 flex flex-col items-start">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="text-white/90 text-sm font-medium uppercase tracking-wide mb-1">Projects</h3>
                <p className="text-4xl font-bold text-white">{projects.length}</p>
                <div className="mt-3 text-white/80 text-xs">Total active projects</div>
              </div>
            </article>

      
            <article className="group relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-6 flex flex-col items-start">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white/90 text-sm font-medium uppercase tracking-wide mb-1">Services</h3>
                <p className="text-4xl font-bold text-white">{services.length}</p>
                <div className="mt-3 text-white/80 text-xs">Available services</div>
              </div>
            </article>

           
            <article className="group relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-6 flex flex-col items-start">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-white/90 text-sm font-medium uppercase tracking-wide mb-1">Features</h3>
                <p className="text-4xl font-bold text-white">{features.length}</p>
                <div className="mt-3 text-white/80 text-xs">Platform features</div>
              </div>
            </article>

            <article className="group relative bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-6 flex flex-col items-start">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white/90 text-sm font-medium uppercase tracking-wide mb-1">Inquiries</h3>
                <p className="text-4xl font-bold text-white">{inquiries.length}</p>
                <div className="mt-3 text-white/80 text-xs">Customer inquiries</div>
              </div>
            </article>
          </div>
        </section>

     
        <section aria-label="Recent Inquiries" className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Recent Inquiries</h2>
                <p className="text-sm text-slate-600 mt-1">Latest customer messages and requests</p>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last 5 inquiries</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {recentInquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">No inquiries available</p>
                <p className="text-slate-400 text-sm mt-1">New inquiries will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6">
                <div className="inline-block min-w-full align-middle px-6">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                      <tr>
                        <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50 rounded-tl-lg">#</th>
                        <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50">Name</th>
                        <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50 hidden md:table-cell">Email</th>
                        <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50">Message</th>
                        <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-50 rounded-tr-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentInquiries.map((inq, idx) => (
                        <tr key={inq._id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{inq.name}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-slate-600">{inq.email}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-slate-700 max-w-xs truncate">
                              {inq.message.slice(0, 50)}...
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              inq.status === "Replied"
                                ? "bg-green-100 text-green-800"
                                : inq.status === "Seen"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {inq.status || "Pending"}
                            </span>
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
      </div>
    </main>
  );
}