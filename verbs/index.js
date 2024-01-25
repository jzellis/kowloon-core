import Post from "./Post.js"; // Working
import Accept from "./Accept.js";
import Add from "./Add.js"; // Working
import Approve from "./Approve.js";
import Archive from "./Archive.js";
import Assign from "./Assign.js";
import Attach from "./Attach.js";
import Authorize from "./Authorize.js"; //Working
import Block from "./Block.js"; //Working
import Cancel from "./Cancel.js";
import Checkin from "./Checkin.js";
import Confirm from "./Confirm.js";
import Create from "./Create.js"; // Working
import Delete from "./Delete.js"; //Working
import Deliver from "./Deliver.js";
import Deny from "./Deny.js";
import Flag from "./Flag.js"; // Working
import Follow from "./Follow.js"; //Working
import Host from "./Host.js";
import Ignore from "./Ignore.js";
import Invite from "./Invite.js";
import Join from "./Join.js"; // Working
import Leave from "./Leave.js"; //Working
import Like from "./Like.js"; //Working
import Login from "./Login.js"; //Working
import Play from "./Play.js";
import Read from "./Read.js";
import Receive from "./Receive.js";
import Reject from "./Reject.js";
import Request from "./Request.js";
import RsvpMaybe from "./RsvpMaybe.js";
import RsvpNo from "./RsvpNo.js";
import RsvpYes from "./RsvpYes.js";
import Save from "./Save.js"; //Working
import Search from "./Search.js";
import Send from "./Send.js";
import Share from "./Share.js";
import Tag from "./Tag.js";
import Unlike from "./Unlike.js"; //Working
import Unfollow from "./Unfollow.js"; //Working
import Unsave from "./Unsave.js"; //Working
import Update from "./Update.js"; //Working

import {
  // Activity,
  Actor,
  // Circle,
  // Group,
  // Invite,
  // Post,
  Settings,
  User,
} from "../schema/index.js";

const Verbs = {
  Post,
  Accept,
  Add,
  Approve,
  Archive,
  Assign,
  Attach,
  Authorize,
  Block,
  Cancel,
  Checkin,
  Confirm,
  Create,
  Delete,
  Deliver,
  Deny,
  Flag,
  Follow,
  Host,
  Ignore,
  Invite,
  Join,
  Leave,
  Like,
  Login,
  Play,
  Read,
  Receive,
  Reject,
  Request,
  RsvpMaybe,
  RsvpNo,
  RsvpYes,
  Save,
  Search,
  Send,
  Share,
  Tag,
  Unlike,
  Unfollow,
  Unsave,
  Update,
};

const actorRequired = [
  "Create Circle",
  "Create Group",
  "Create Post",
  "Create Setting",
  "Flag",
  "Like",
  "Unlike",
  "Share",
  "Cancel",
  "Join",
  "Leave",
  "Block",
  "Unblock",
  "Post",
];

const adminRequired = [
  "Create Setting",
  "Update Setting",
  "Delete Setting",
  "Block Server",
  "Unblock Server",
];

const ActivityParser = {
  actor: null,
  setActor: function (actor) {
    this.actor = actor;
  },
  parse: async function (activity) {
    let nounVerb = activity.object
      ? `${activity.type} ${activity.objectType}`
      : activity.type;
    switch (true) {
      case !activity:
        return { error: "No activity provided" };
        break;
      case actorRequired.includes(nounVerb) && !activity.actor:
        return { error: "Activity requires an actor" };
        break;
      case adminRequired.includes(nounVerb):
        let admins = (
          await Settings.findOne({ name: "serverAdmins" })
        ).value.map((v) => v.toString());
        let actor = await Actor.findOne({ id: activity.actor });
        let user = await User.findOne({ _id: actor.user });

        if (admins.indexOf(user._id.toString()) == -1)
          return { error: "Activity requires an admin user" };
        break;
      case !Verbs[activity.type]:
        return { error: "Unknown activity type" };
        break;
      default:
        return await Verbs[activity.type](activity);
    }
  },
};

export default ActivityParser;
