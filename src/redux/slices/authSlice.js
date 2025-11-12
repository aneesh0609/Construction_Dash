import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

/* ---------------------- LOGIN ---------------------- */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/signin", formData, {
        withCredentials: true,
      });

      if (data.success && data.user) return data.user;
      return thunkAPI.rejectWithValue(data.message || "Login failed");
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

/* ---------------------- REGISTER ---------------------- */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/signup", formData, {
        withCredentials: true,
      });

      if (data.success && data.user) return data.user;
      return thunkAPI.rejectWithValue(data.message || "Registration failed");
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

/* ---------------------- FETCH CURRENT USER ---------------------- */
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/auth/me", { withCredentials: true });
      if (data.success && data.user) return data.user;
      return null;
    } catch {
      return null;
    }
  }
);

/* ---------------------- LOGOUT ---------------------- */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

/* ---------------------- SLICE ---------------------- */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    initialized: false,
    redirectToDashboard: false, // ✅ Added for clean redirect handling
  },
  reducers: {
    clearRedirectFlag: (state) => {
      state.redirectToDashboard = false; // reset after redirect
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.redirectToDashboard = true; // ✅ triggers redirect
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.initialized = true;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.redirectToDashboard = false;
      });
  },
});

export const { clearRedirectFlag } = authSlice.actions;
export default authSlice.reducer;
