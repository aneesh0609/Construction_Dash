import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Grid, Layers, Image, Star, Menu, X, Phone, LogOut, Badge, Laptop } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Projects", path: "/projects", icon: <Grid size={20} /> },
    { name: "Services", path: "/services", icon: <Layers size={20} /> },
    { name: "Features", path: "/features", icon: <Star size={20} /> },
    { name: "Gallery", path: "/gallery", icon: <Image size={20} /> },
    { name: "Job", path: "/job", icon: <Badge size={20} /> },
    { name: "Career", path: "/career", icon: <Laptop size={20} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={20} /> },
  ];


  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // handles cookie clearing
      toast.success("Logged out successfully!", { position: "top-right" });
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.", { position: "top-right" });
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-transform bg-stone-800 text-white flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 text-2xl font-bold border-b border-gray-700 flex justify-between items-center">
          Beenu Admin
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
                location.pathname === link.path ? "bg-blue-700" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.icon} <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button for Mobile */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-md transition-all duration-300"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-stone-800 min-h-screen text-white flex-col justify-between">
        <div>
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            Bennu Construction
          </div>
          <nav className="mt-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition-colors ${
                  location.pathname === link.path ? "bg-gray-700" : ""
                }`}
              >
                {link.icon} <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button for Desktop */}
        <div className="border-t border-gray-700 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-md transition-all duration-300"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded shadow hover:bg-gray-700 transition"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
}
