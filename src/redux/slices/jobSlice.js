import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";
import { toast } from "react-toastify";

/* -------------------------
   FETCH ALL JOBS
-------------------------- */
export const fetchJobs = createAsyncThunk("jobs/fetchAll", async (_, thunkAPI) => {
  try {
    const { data } = await API.get("/jobs/all");
    return data.jobs;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to fetch jobs");
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

/* -------------------------
   CREATE JOB
-------------------------- */
export const createJob = createAsyncThunk("jobs/create", async (formData, thunkAPI) => {
  try {
    const { data } = await API.post("/jobs/create", formData);
    toast.success("✅ Job created successfully!");
    return data.job;
  } catch (err) {
    toast.error(err.response?.data?.message || "Job creation failed");
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

/* -------------------------
   UPDATE JOB
-------------------------- */
export const updateJob = createAsyncThunk("jobs/update", async ({ id, formData }, thunkAPI) => {
  try {
    const { data } = await API.put(`/jobs/${id}`, formData);
    toast.success("✅ Job updated successfully!");
    return data.job;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update job");
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

/* -------------------------
   DELETE JOB
-------------------------- */
export const deleteJob = createAsyncThunk("jobs/delete", async (id, thunkAPI) => {
  try {
    await API.delete(`/jobs/${id}`);
    toast.success("🗑️ Job deleted successfully");
    return id;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete job");
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

/* -------------------------
   SLICE SETUP
-------------------------- */
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetJobState: (state) => {
      state.jobs = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state) => {
        state.loading = false;
      })

      // Create
      .addCase(createJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state) => {
        state.loading = false;
      })

      // Update
      .addCase(updateJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.map((j) =>
          j._id === action.payload._id ? action.payload : j
        );
      })

      // Delete
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
      });
  },
});

export const { resetJobState } = jobSlice.actions;
export default jobSlice.reducer;
