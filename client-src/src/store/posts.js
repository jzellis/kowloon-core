/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import Kowloon from "../lib/Kowloon";

export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    page: 1,
  },
  reducers: {
    resetPosts: (state) => {
      state.items = [];
    },
    setPosts: (state, action) => {
      state.items = action.payload;
    },
    addPosts: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    incrementPage: (state) => {
      state.page = state.page + 1;
      console.log("State page: ", state.page);
    },
    decrementPage: (state) => {
      state.page--;
    },
  },
});

// Action creators are generated for each case reducer function
export const { resetPosts, setPosts, addPosts, incrementPage, decrementPage } =
  postsSlice.actions;

export default postsSlice.reducer;
