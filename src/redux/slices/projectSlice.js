import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";
import { toast } from "react-toastify";

// GET ALL PROJECTS
export const fetchProjects = createAsyncThunk("projects/getAll", async (_, thunkAPI) => {
  try {
    const { data } = await API.get("/projects");
    return data.projects;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to load projects");
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

// GET SINGLE PROJECT
export const fetchProject = createAsyncThunk("projects/getOne", async (slug, thunkAPI) => {
  try {
    const { data } = await API.get(`/projects/${slug}`);
    return data.project;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to fetch project");
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

// CREATE PROJECT
export const createProject = createAsyncThunk("projects/create", async (formData, thunkAPI) => {
  try {
    const { data } = await API.post("/projects/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("✅ Project created successfully!");
    return data.project;
  } catch (err) {
    toast.error(err.response?.data?.message || "Project creation failed");
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

// UPDATE PROJECT
export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ slug, formData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/projects/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Project updated successfully!");
      return data.project;
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// DELETE PROJECT
export const deleteProject = createAsyncThunk("projects/delete", async (slug, thunkAPI) => {
  try {
    await API.delete(`/projects/${slug}`);
    toast.success("🗑️ Project deleted");
    return slug;
  } catch (err) {
    toast.error(err.response?.data?.message || "Delete failed");
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    project: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetProjectState: (s) => {
      s.project = null;
      s.error = null;
      s.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (s) => { s.loading = true; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.projects = a.payload; })
      .addCase(fetchProjects.rejected, (s) => { s.loading = false; })

      .addCase(fetchProject.pending, (s) => { s.loading = true; })
      .addCase(fetchProject.fulfilled, (s, a) => { s.loading = false; s.project = a.payload; })
      .addCase(fetchProject.rejected, (s) => { s.loading = false; })

      .addCase(createProject.pending, (s) => { s.loading = true; })
      .addCase(createProject.fulfilled, (s, a) => {
        s.loading = false;
        s.projects.unshift(a.payload);
      })
      .addCase(createProject.rejected, (s) => { s.loading = false; })

      .addCase(updateProject.fulfilled, (s, a) => {
        s.projects = s.projects.map((p) => (p.slug === a.payload.slug ? a.payload : p));
      })

      .addCase(deleteProject.fulfilled, (s, a) => {
        s.projects = s.projects.filter((p) => p.slug !== a.payload);
      });
  },
});

export const { resetProjectState } = projectSlice.actions;
export default projectSlice.reducer;
