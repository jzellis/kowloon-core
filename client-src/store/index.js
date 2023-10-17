import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./ui";

export default configureStore({
  reducer: {
    ui: uiReducer,
  },
});
