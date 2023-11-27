import { createSlice } from "@reduxjs/toolkit";

const kowloonSlice = createSlice({
  name: "kowloon",
  initialState: {
    settings: {},
  },
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
  },
});

export const { setSettings } = kowloonSlice.actions;
export default kowloonSlice.reducer;
