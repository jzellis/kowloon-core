import { createSlice } from "@reduxjs/toolkit";
import { stateToHTML } from "draft-js-export-html";

let state = JSON.parse(localStorage.getItem("editorState")) || {
  title: "",
  postType: "Note",
  content: "",
  contentLength: 0,
  characterCount: 0,
  wordCount: 0,
  link: "",
  featuredImage: "",
  images: [],
  uploads: [],
  lengthWarning: false,
  isPublic: false,
  circle: "",
  maxLength: 500,
};
const postSlice = createSlice({
  name: "post",
  initialState: state,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setPostType: (state, action) => {
      console.log(action.payload);
      state.postType = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setCharacterCount: (state, action) => {
      state.characterCount = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setWordCount: (state, action) => {
      state.wordCount = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },

    setLink: (state, action) => {
      state.link = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setFeaturedImage: (state, action) => {
      state.featuredImage = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setImages: (state, action) => {
      state.images = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setUploads: (state, action) => {
      state.uploads = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setContentLength: (state, action) => {
      state.contentLength = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setLengthWarning: (state, action) => {
      state.lengthWarning = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setIsPublic: (state, action) => {
      state.isPublic = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setCircle: (state, action) => {
      state.circle = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setContent: (state, action) => {
      state.content = action.payload;
      localStorage.setItem("editorState", JSON.stringify(state));
    },
    setEditorState: (state, action) => {
      let editorState = action.payload;
    },
  },
});

export const {
  setTitle,
  setPostType,
  setCharacterCount,
  setWordCount,
  setLink,
  setFeaturedImage,
  setImages,
  setUploads,
  setLengthWarning,
  setIsPublic,
  setCircle,
  setMaxLength,
  setContent,
} = postSlice.actions;
export default postSlice.reducer;
