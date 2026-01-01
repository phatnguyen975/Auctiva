import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import type { Category } from "../../types/category";

export const getCategories = createAsyncThunk(
  "categories/get",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/categories", {
        headers: { "x-api-key": import.meta.env.VITE_API_KEY },
      });

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

type CategoryState = {
  data: Category[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
};

const initialState: CategoryState = {
  data: [],
  loading: false,
  error: null,
  loaded: false,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategories(state) {
      state.data = [];
      state.loaded = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.loaded = true;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCategories } = categorySlice.actions;

export default categorySlice.reducer;
