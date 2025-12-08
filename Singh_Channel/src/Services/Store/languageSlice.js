import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current: "en",
    available: {
        en: { code: "en", name: "English" },
        hi: { code: "hi", name: "हिंदी" },
        pu: { code: "pu", name: "ਪੰਜਾਬੀ" }, // Changed from "pa" to "pu"
    },
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage(state, action) {
            state.current = action.payload;
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;