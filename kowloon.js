import _createUser from "./methods/internal/_createUser.js";
import _updateUser from "./methods/internal/_updateUser.js";
import _getActivities from "./methods/internal/_getActivities.js";
import _getActivity from "./methods/internal/_getActivity.js";
import _getActor from "./methods/internal/_getActor.js";
import _getActors from "./methods/internal/_getActors.js";
import _getCircle from "./methods/internal/_getCircle.js";
import _getCircles from "./methods/internal/_getCircles.js";
import _getGroup from "./methods/internal/_getGroup.js";
import _getPost from "./methods/internal/_getPost.js";
import _getPosts from "./methods/internal/_getPosts.js";
import _getSettings from "./methods/internal/_getSettings.js";
import _getUser from "./methods/internal/_getUser.js";
import _getUsers from "./methods/internal/_getUsers.js";
import auth from "./methods/other/auth.js";
import createActivity from "./methods/create/createActivity.js";
import createActor from "./methods/create/createActor.js";
import createCircle from "./methods/create/createCircle.js";
import createGroup from "./methods/create/createGroup.js";
import createPost from "./methods/create/createPost.js";
import createReply from "./methods/create/createReply.js";
import getActivity from "./methods/get/getActivity.js";
import getActor from "./methods/get/getActor.js";
import getActorPosts from "./methods/get/getActorPosts.js";
import getActorTimeline from "./methods/get/getActorTimeline.js";
import getCircle from "./methods/get/getCircle.js";
import getGroup from "./methods/get/getGroup.js";
import getGroupPosts from "./methods/get/getGroupPosts.js";
import getPost from "./methods/get/getPost.js";
import getPublicTimeline from "./methods/get/getPublicTimeline.js";
import init from "./methods/other/init.js";
import likePost from "./methods/other/likePost.js";
import login from "./methods/other/login.js";
import sanitize from "./methods/other/sanitize.js";
import setUser from "./methods/other/setUser.js";
import unlikePost from "./methods/other/unlikePost.js";
import joinGroup from "./methods/other/joinGroup.js";
// const serverMethodDir = __dirname + `/methods/server/`;
const methodDir = `./methods/`;
const Kowloon = {
  settings: {},
  user: null,
  actor: null,
  target: null,
  subject: null,
  sanitizedFields: "-privateKey -_id -__v -bto -bcc -password",
  testing: true,
  redis: null,
  outboxQueue: null,
  connection: {},
  postTypes: ["Note", "Article", "Media", "Link"],
  activityVerbs: {
    contentManagement: ["Create", "Delete", "Update"],
    collectionManagement: ["Add", "Move", "Remove"],
    reactions: [
      "Accept",
      "Dislike",
      "Flag",
      "Ignore",
      "Like",
      "Reject",
      "TentativeAccept",
      "TentativeReject",
    ],
    groupManagement: ["Join", "Leave"],
    contentExperience: ["Listen", "Read", "View"],
    relationshipExperience: ["Block", "Follow", "Ignore", "Invite", "Reject"],
    negation: ["Undo"],
  },
  _createUser,
  _updateUser,
  _getActivities,
  _getActivity,
  _getActor,
  _getActors,
  _getCircle,
  _getCircles,
  _getGroup,
  _getPost,
  _getPosts,
  _getSettings,
  _getUser,
  _getUsers,
  auth,
  createActivity,
  createActor,
  createCircle,
  createGroup,
  createPost,
  createReply,
  getActivity,
  getActor,
  getActorPosts,
  getActorTimeline,
  getCircle,
  getGroup,
  getGroupPosts,
  getPost,
  getPublicTimeline,
  init,
  likePost,
  login,
  sanitize,
  setUser,
  unlikePost,
  joinGroup,
};

await Kowloon.init();

export default Kowloon;
