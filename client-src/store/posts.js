/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import Kowloon from "../src/lib/Kowloon";

export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
  },
  reducers: {
    resetPosts: (state) => {
      state.items = [];
    },
    setPosts: (state, action) => {
      state.items = action.payload;
    },
    addPost: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { resetPosts, setPosts, addPost } = postsSlice.actions;

export default postsSlice.reducer;
