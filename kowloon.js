// Imports and re - imports all methods that need to be defined in order to be consistent with the specification

/**
 * @namespace kowloon
 */

import _createUser from "./methods/internal/_createUser.js";
import _deleteUser from "./methods/internal/_deleteUser.js";
import _updateUser from "./methods/internal/_updateUser.js";
import _getActivities from "./methods/internal/_getActivities.js";
import _getActivity from "./methods/internal/_getActivity.js";
import _getActor from "./methods/internal/_getActor.js";
import _getActors from "./methods/internal/_getActors.js";
import _getCircle from "./methods/internal/_getCircle.js";
import _getCircles from "./methods/internal/_getCircles.js";
import _getGroup from "./methods/internal/_getGroup.js";
import _getGroups from "./methods/internal/_getGroups.js";
import _getPost from "./methods/internal/_getPost.js";
import _getPosts from "./methods/internal/_getPosts.js";
import _getSettings from "./methods/internal/_getSettings.js";
import _getUser from "./methods/internal/_getUser.js";
import _getUsers from "./methods/internal/_getUsers.js";
import auth from "./methods/other/auth.js";
import createActivity from "./methods/create/createActivity.js";
import getActivity from "./methods/get/getActivity.js";
import getActivities from "./methods/get/getActivities.js";
import getActor from "./methods/get/getActor.js";
import getActors from "./methods/get/getActors.js";
import getCircle from "./methods/get/getCircle.js";
import getGroup from "./methods/get/getGroup.js";
import getPost from "./methods/get/getPost.js";
import getPosts from "./methods/get/getPosts.js";
import init from "./methods/internal/init.js";
import login from "./methods/other/login.js";
import sanitize from "./methods/internal/sanitize.js";
import _setUser from "./methods/internal/_setUser.js";
import __reset from "./methods/internal/__reset.js";
import _countActivities from "./methods/internal/_countActivities.js";
import _countActors from "./methods/internal/_countActors.js";
import _countCircles from "./methods/internal/_countCircles.js";
import _countGroups from "./methods/internal/_countGroups.js";
import _countPosts from "./methods/internal/_countPosts.js";
import _countUsers from "./methods/internal/_countUsers.js";
import _retrieveFeeds from "./methods/internal/_retrieveFeeds.js";
import _createSetting from "./methods/internal/_createSetting.js";
import _updateSetting from "./methods/internal/_updateSetting.js";
import _setup from "./methods/internal/_setup.js";
import _generatePassword from "./methods/internal/_generatePassword.js";
import _validateActivity from "./methods/internal/_validateActivity.js";
import _validateActor from "./methods/internal/_validateActor.js";
import _validatePost from "./methods/internal/_validatePost.js";
/** @type {*} */
const Kowloon = {
  settings: {},
  user: null,
  actor: null,
  target: null,
  subject: null,
  sanitizedFields: [
    "bto",
    "bcc",
    "password",
    "privateKey",
    "lastTimelineUpdate",
    "circles",
    "blocked",
    "_id",
    "__v",
    "user",
  ],
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
  _deleteUser,
  _updateUser,
  _getActivities,
  _getActivity,
  _getActor,
  _getActors,
  _getCircle,
  _getCircles,
  _getGroup,
  _getGroups,
  _getPost,
  _getPosts,
  _getSettings,
  _getUser,
  _getUsers,
  auth,
  createActivity,
  getActivity,
  getActivities,
  getActor,
  getActors,
  getCircle,
  getGroup,
  getPost,
  getPosts,
  init,
  login,
  sanitize,
  _setUser,
  __reset,
  _countActivities,
  _countActors,
  _countCircles,
  _countGroups,
  _countPosts,
  _countUsers,
  _retrieveFeeds,
  _createSetting,
  _updateSetting,
  _setup,
  _generatePassword,
  _validateActivity,
  _validateActor,
  _validatePost,
};
await Kowloon.init();

export default Kowloon;
