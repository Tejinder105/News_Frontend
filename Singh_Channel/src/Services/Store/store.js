import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./languageSlice";
import breakingNewsReducer from "./breakingNewsSlice";

const store = configureStore({
  reducer: {
    language: languageReducer,
    breakingNews: breakingNewsReducer,
  },
});

export default store;
