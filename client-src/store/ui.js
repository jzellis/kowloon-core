/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import Kowloon from "../src/lib/Kowloon";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    settings: {},
    loggedIn: false,
    user: {},
    postEditorOpen: false,
  },
  reducers: {
    setSettings(state, action) {
      state.settings = action.payload;
    },
    togglePostEditor(state) {
      state.postEditorOpen = !state.postEditorOpen;
    },
    login: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
      state.loggedIn = true;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, setSettings, setUser, logout, togglePostEditor } =
  uiSlice.actions;

export default uiSlice.reducer;
