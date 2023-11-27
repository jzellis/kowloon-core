import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import kowloonReducer from "./kowloon";

export default configureStore({
  reducer: {
    user: userReducer,
    kowloon: kowloonReducer,
  },
});
