import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import kowloonReducer from "./kowloon";
import uiReducer from "./ui";
import postReducer from "./editor";

export default configureStore({
  reducer: {
    user: userReducer,
    kowloon: kowloonReducer,
    ui: uiReducer,
    post: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["your/action/type"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
      },
    }),
});
