import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

// GET ALL Gallery Items
export const fetchGallery = createAsyncThunk("gallery/getAll", async (_, thunkAPI) => {
  try {
    const { data } = await API.get("/gallery/all");
    return data.items;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

// CREATE Gallery Item
export const createGallery = createAsyncThunk("gallery/create", async (formData, thunkAPI) => {
  try {
    const { data } = await API.post("/gallery/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.item;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

// UPDATE Gallery Item
export const updateGallery = createAsyncThunk(
  "gallery/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/gallery/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.item;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// DELETE Gallery Item
export const deleteGallery = createAsyncThunk("gallery/delete", async (id, thunkAPI) => {
  try {
    await API.delete(`/gallery/delete/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    gallery: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(fetchGallery.pending, (state) => { state.loading = true; })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createGallery.fulfilled, (state, action) => {
        state.gallery.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.gallery = state.gallery.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })

      // DELETE
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.gallery = state.gallery.filter((item) => item._id !== action.payload);
      });
  },
});

export default gallerySlice.reducer;
