import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  breakingNews: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const breakingNewsSlice = createSlice({
  name: "breakingNews",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBreakingNews: (state, action) => {
      state.breakingNews = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetched = Date.now();
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearBreakingNews: (state) => {
      state.breakingNews = [];
      state.error = null;
    },
  },
});

export const { setLoading, setBreakingNews, setError, clearBreakingNews } = breakingNewsSlice.actions;
export default breakingNewsSlice.reducer;
