import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, clearRedirectFlag } from "../redux/slices/authSlice";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user, redirectToDashboard } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Redirect to dashboard once logged in
  useEffect(() => {
    if (redirectToDashboard && user) {
      const toastId = toast.success("Admin logged in successfully!");
      setTimeout(() => {
        toast.dismiss(toastId);
        navigate("/dashboard");
        dispatch(clearRedirectFlag());
        setIsSubmitting(false); // re-enable button
      }, 900);
    }
  }, [redirectToDashboard, user, navigate, dispatch]);

  // ✅ Handle form submission safely
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple clicks

    setIsSubmitting(true);

    try {
      await dispatch(loginUser(formData)).unwrap();
    } catch (err) {
      toast.error(err || "Login failed. Please try again.");
      setIsSubmitting(false); // re-enable button if error
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 space-y-5 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Admin Login
        </h2>

        {error && (
          <p className="text-center text-red-500 text-sm bg-red-50 py-2 rounded">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 text-white font-medium rounded-lg shadow-md transition-all flex justify-center items-center ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-gray-500 text-sm">
          Only authorized admins can access this panel.
        </p>
      </form>
    </div>
  );
}
