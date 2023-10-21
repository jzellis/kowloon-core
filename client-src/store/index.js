import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./ui";
import postsReducer from "./posts";

export default configureStore({
  reducer: {
    ui: uiReducer,
    posts: postsReducer,
  },
});
