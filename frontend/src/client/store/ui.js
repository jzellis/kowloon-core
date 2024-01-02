import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showPostEditor: false,
    showFollowForm: false,
    currentPost: {},
  },
  reducers: {
    showPostEditor: (state) => {
      state.showPostEditor = true;
    },
    hidePostEditor: (state) => {
      state.showPostEditor = false;
    },
    togglePostEditor: (state) => {
      state.showPostEditor = !state.showPostEditor;
    },

    showFollowForm: (state) => {
      state.showFollowForm = true;
    },
    hideFollowForm: (state) => {
      state.showFollowForm = false;
    },
    toggleFollowForm: (state) => {
      state.showFollowForm = !state.showFollowForm;
    },
  },
});

export const {
  showPostEditor,
  hidePostEditor,
  togglePostEditor,
  showFollowForm,
  hideFollowForm,
  toggleFollowForm,
} = uiSlice.actions;
export default uiSlice.reducer;
