import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./languageSlice";
import breakingNewsReducer from "./breakingNewsSlice";
import { apiSlice } from "./apiSlice";

const store = configureStore({
  reducer: {
    language: languageReducer, // Keeping for other components
    breakingNews: breakingNewsReducer, // Keeping for backward compatibility for now
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
