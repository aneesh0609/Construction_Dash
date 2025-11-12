import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./components/AdminLayout";
import ProjectsAdmin from "./pages/Project";
import ServicesAdminPage from "./pages/Services";
import FeaturesAdminPage from "./pages/Features";
import GalleryPage from "./pages/Gallery";
import ContactPage from "./pages/Contact";
import AdminDashboard from "./pages/Dashboard";
import { fetchCurrentUser } from "./redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CareerApplications from "./pages/Career";
import AdminJobDashboard from "./pages/Job";

function App() {
 
  const dispatch = useDispatch();
  const { initialized, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser()); 
  }, [dispatch]);

  if (!initialized || loading)
    return <div className="text-center p-10">Loading...</div>;
  
  return (
    <BrowserRouter>   
               <ToastContainer position="top-right" autoClose={2200} />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* Projects Admin Page */}
           <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="services" element={<ServicesAdminPage />} />
          <Route path="features" element={<FeaturesAdminPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="job" element={<AdminJobDashboard />} />
          <Route path="career" element={<CareerApplications />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
