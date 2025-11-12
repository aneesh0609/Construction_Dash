import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/";

// FETCH ALL INQUIRIES (Admin)
export const fetchInquiries = createAsyncThunk(
  "contact/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/contact");
      return data.inquiries;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// SUBMIT INQUIRY (Public)
export const submitInquiry = createAsyncThunk(
  "contact/submit",
  async (formData, thunkAPI) => {
    try {
      const { data } = await API.post("/contact/submit", formData);
      return data.inquiry;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// UPDATE INQUIRY STATUS (Admin)
export const updateInquiryStatus = createAsyncThunk(
  "contact/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const { data } = await API.put(`/contact/${id}`, { status });
      return data.inquiry;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// DELETE INQUIRY (Admin)
export const deleteInquiry = createAsyncThunk(
  "contact/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/contact/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    inquiries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchInquiries.pending, (state) => { state.loading = true; })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload;
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit
      .addCase(submitInquiry.fulfilled, (state, action) => {
        state.inquiries.unshift(action.payload);
      })
      .addCase(submitInquiry.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        state.inquiries = state.inquiries.map((inq) =>
          inq._id === action.payload._id ? action.payload : inq
        );
      })
      .addCase(updateInquiryStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteInquiry.fulfilled, (state, action) => {
        state.inquiries = state.inquiries.filter((inq) => inq._id !== action.payload);
      })
      .addCase(deleteInquiry.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
