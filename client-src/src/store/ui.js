/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import Kowloon from "../lib/Kowloon";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    settings: {},
    loggedIn: false,
    user: {},
    postEditorOpen: false,
    imageModalOpen: false,
    drawerOpen: false,
    imageModalUrl: "",
    newPostType: "Article",
  },
  reducers: {
    setSettings(state, action) {
      state.settings = action.payload;
    },
    togglePostEditor(state) {
      state.postEditorOpen = !state.postEditorOpen;
    },
    toggleDrawer(state) {
      state.drawerOpen = !state.drawerOpen;
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
    showImageModal: (state, action) => {
      state.imageModalOpen = true;
      state.imageModalUrl = action.payload;
    },
    hideImageModal: (state) => {
      state.imageModalOpen = false;
    },
    changePostType: (state, action) => {
      state.newPostType = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  login,
  setSettings,
  setUser,
  logout,
  togglePostEditor,
  toggleDrawer,
  showImageModal,
  hideImageModal,
  changePostType,
} = uiSlice.actions;

export default uiSlice.reducer;
