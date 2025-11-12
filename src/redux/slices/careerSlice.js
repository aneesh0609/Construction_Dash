import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";
import { toast } from "react-toastify";

/* -------------------------
   FETCH ALL APPLICATIONS
-------------------------- */
export const fetchApplications = createAsyncThunk(
  "careers/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/careers/all");
      // ✅ Backend returns `applicants`, not `applications`
      return data.applicants || [];
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load applications");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

/* -------------------------
   DELETE APPLICATION
-------------------------- */
export const deleteApplication = createAsyncThunk(
  "careers/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/careers/${id}`);
      toast.success("🗑️ Application deleted successfully");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete application");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

/* -------------------------
   SLICE SETUP
-------------------------- */
const careerSlice = createSlice({
  name: "careers",
  initialState: {
    applications: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetCareerState: (state) => {
      state.applications = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state) => {
        state.loading = false;
      })

      // Delete application
      .addCase(deleteApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = state.applications.filter(
          (app) => app._id !== action.payload
        );
      })
      .addCase(deleteApplication.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetCareerState } = careerSlice.actions;
export default careerSlice.reducer;
