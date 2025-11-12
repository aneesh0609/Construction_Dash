// src/redux/slices/servicesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";
import { toast } from "react-toastify";



export const fetchServices = createAsyncThunk("services/fetchAll", async (_, thunkAPI) => {
  try {
    const { data } = await API.get("/services/all");
    return data.services || [];
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to load services";
    toast.error(msg);
    return thunkAPI.rejectWithValue(msg);
  }
});

export const createService = createAsyncThunk("services/create", async (formData, thunkAPI) => {
  try {
    const { data } = await API.post("/services/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Service created");
    return data.service;
  } catch (err) {
    const msg = err.response?.data?.message || "Create failed";
    toast.error(msg);
    return thunkAPI.rejectWithValue(msg);
  }
});

export const updateService = createAsyncThunk(
  "services/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/services/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Service updated");
      return data.service;
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const deleteService = createAsyncThunk("services/delete", async (id, thunkAPI) => {
  try {
    const { data } = await API.delete(`/services/delete/${id}`);
    toast.success("Service deleted");
    return id;
  } catch (err) {
    const msg = err.response?.data?.message || "Delete failed";
    toast.error(msg);
    return thunkAPI.rejectWithValue(msg);
  }
});

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    services: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetServicesState: (state) => {
      state.services = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (s) => { s.loading = true; })
      .addCase(fetchServices.fulfilled, (s, a) => { s.loading = false; s.services = a.payload; })
      .addCase(fetchServices.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createService.pending, (s) => { s.loading = true; })
      .addCase(createService.fulfilled, (s, a) => {
        s.loading = false;
        // add to front for visibility
        s.services.unshift(a.payload);
      })
      .addCase(createService.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateService.fulfilled, (s, a) => {
        s.services = s.services.map((it) => (it._id === a.payload._id ? a.payload : it));
      })

      .addCase(deleteService.fulfilled, (s, a) => {
        s.services = s.services.filter((it) => it._id !== a.payload);
      });
  },
});

export const { resetServicesState } = servicesSlice.actions;
export default servicesSlice.reducer;
