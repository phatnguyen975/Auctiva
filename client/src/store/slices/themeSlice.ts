import { createSlice } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const storedTheme = (localStorage.getItem("theme") as ThemeMode) || null;
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

const initialState: ThemeState = { mode: initialTheme };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
