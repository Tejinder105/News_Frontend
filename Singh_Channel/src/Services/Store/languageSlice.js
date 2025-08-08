import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedLanguage: localStorage.getItem("selectedLanguage") || "en",
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.selectedLanguage = action.payload;
            localStorage.setItem("selectedLanguage", action.payload);
        },
    },
});
export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;