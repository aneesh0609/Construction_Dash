// src/redux/slices/featuresSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";
import { toast } from "react-toastify";


export const fetchFeatures = createAsyncThunk("features/fetchAll", async (_, thunkAPI) => {
  try {
    const { data } = await API.get("/features/all");
    return data.features || [];
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to load features";
    toast.error(msg);
    return thunkAPI.rejectWithValue(msg);
  }
});

export const createFeature = createAsyncThunk("features/create", async (payload, thunkAPI) => {
  try {
    const { data } = await API.post("/features/create", payload);
    toast.success("Feature created");
    return data.feature;
  } catch (err) {
    const msg = err.response?.data?.message || "Create failed";
    toast.error(msg);
    return thunkAPI.rejectWithValue(msg);
  }
});

export const updateFeature = createAsyncThunk("features/update", async ({ id, payload }, thunkAPI) => {
  try {
    const { data } = await API.put(`/features/update/${id}`, payload);
    toast.success("Feature updated");
    return data.feature;
  } catch (err) {
    const msg = err.response?.data?.message || "Update failed";
    toast.error(msg);
    return thunkAPI.rejectWithValue(msg);
  }
});

export const deleteFeature = createAsyncThunk("features/delete", async (id, thunkAPI) => {
  try {
    await API.delete(`/features/delete/${id}`);
    toast.success("Feature deleted");
    return id;
  } catch (err) {
    const msg = err.response?.data?.message || "Delete failed";
    toast.error(msg);
    return thunkAPI.rejectWithValue(msg);
  }
});

const featuresSlice = createSlice({
  name: "features",
  initialState: {
    features: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetFeaturesState: (state) => {
      state.features = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (s) => { s.loading = true; })
      .addCase(fetchFeatures.fulfilled, (s, a) => { s.loading = false; s.features = a.payload; })
      .addCase(fetchFeatures.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createFeature.pending, (s) => { s.loading = true; })
      .addCase(createFeature.fulfilled, (s, a) => {
        s.loading = false;
        s.features.unshift(a.payload);
      })
      .addCase(createFeature.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateFeature.fulfilled, (s, a) => {
        s.features = s.features.map((it) => (it._id === a.payload._id ? a.payload : it));
      })

      .addCase(deleteFeature.fulfilled, (s, a) => {
        s.features = s.features.filter((it) => it._id !== a.payload);
      });
  },
});

export const { resetFeaturesState } = featuresSlice.actions;
export default featuresSlice.reducer;
