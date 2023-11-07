import headers from "./methods/headers";
import login from "./methods/login";
import get from "./methods/get";
import post from "./methods/post";
import getSettings from "./methods/getSettings";
import getPublicTimeline from "./methods/getPublicTimeline";
import getPost from "./methods/getPost";
import getUser from "./methods/getUser";
import getUserPosts from "./methods/getUserPosts";
import upload from "./methods/upload";
import getLinkPreview from "./methods/getLinkPreview";
import addPost from "./methods/addPost";
import addReply from "./methods/addReply";

const user = JSON.parse(localStorage.getItem("user"));
const kowloon = {
  user,
  headers,
  login,
  get,
  post,
  getSettings,
  getPublicTimeline,
  getPost,
  getUser,
  getUserPosts,
  upload,
  getLinkPreview,
  addPost,
  addReply,
};

const Kowloon = kowloon;
export default Kowloon;
