import Post from "./Post.js";
import Accept from "./Accept.js";
import Add from "./Add.js";
import Approve from "./Approve.js";
import Archive from "./Archive.js";
import Assign from "./Assign.js";
import Attach from "./Attach.js";
import Authorize from "./Authorize.js";
import Block from "./Block.js";
import Cancel from "./Cancel.js";
import Checkin from "./Checkin.js";
import Confirm from "./Confirm.js";
import Create from "./Create.js";
import Delete from "./Delete.js";
import Deliver from "./Deliver.js";
import Deny from "./Deny.js";
import Flag from "./Flag.js";
import Follow from "./Follow.js";
import Host from "./Host.js";
import Ignore from "./Ignore.js";
import Invite from "./Invite.js";
import Join from "./Join.js";
import Leave from "./Leave.js";
import Like from "./Like.js";
import Login from "./Login.js";
import Play from "./Play.js";
import Read from "./Read.js";
import Receive from "./Receive.js";
import Reject from "./Reject.js";
import Request from "./Request.js";
import RsvpMaybe from "./RsvpMaybe.js";
import RsvpNo from "./RsvpNo.js";
import RsvpYes from "./RsvpYes.js";
import Save from "./Save.js";
import Search from "./Search.js";
import Send from "./Send.js";
import Share from "./Share.js";
import Tag from "./Tag.js";
import Unblock from "./Unblock.js";
import Unlike from "./Unlike.js";
import Unfollow from "./Unfollow.js";
import Unsave from "./Unsave.js";
import Update from "./Update.js";

const Verbs = {
  Post: Post,
  Accept: Accept,
  Add: Add,
  Approve: Approve,
  Archive: Archive,
  Assign: Assign,
  Attach: Attach,
  Authorize: Authorize,
  Block: Block,
  Cancel: Cancel,
  Checkin: Checkin,
  Confirm: Confirm,
  Create: Create,
  Delete: Delete,
  Deliver: Deliver,
  Deny: Deny,
  Flag: Flag,
  Follow: Follow,
  Host: Host,
  Ignore: Ignore,
  Invite: Invite,
  Join: Join,
  Leave: Leave,
  Like: Like,
  Login: Login,
  Play: Play,
  Read: Read,
  Receive: Receive,
  Reject: Reject,
  Request: Request,
  RsvpMaybe: RsvpMaybe,
  RsvpNo: RsvpNo,
  RsvpYes: RsvpYes,
  Save: Save,
  Search: Search,
  Send: Send,
  Share: Share,
  Tag: Tag,
  Unblock: Unblock,
  Unlike: Unlike,
  Unfollow: Unfollow,
  Unsave: Unsave,
  Update: Update,
};

// These are activity verb-noun pairs that require an actor
const actorRequired = [
  ["Create", "Circle"],
  ["Create", "Group"],
  ["Create", "Post"],
  ["Create", "Setting"],
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
  ["Create", "Setting"],
  ["Update", "Setting"],
  ["Delete", "Setting"],
  ["Block", "Server"],
  ["Unblock", "Server"],
];

const Parser = {
  parse: function (verb, activity) {
    let response = {};
    if (!activity) return { error: new Error("No activity provided") };
    let nounVerb = activity.object
      ? [activity.type, activity.objectType]
      : activity.type;
    if (actorRequired.includes(nounVerb) && !activity.actor)
      return { error: new Error("Activity has no actor") };
    if (adminRequired.includes(nounVerb) && !activity.actor.is_admin)
      return { error: new Error("Not an admin") };
    if (!Verbs[verb]) return { error: new Error("Unknown activity type") };
    return Verbs[verb](activity);
  },
};

export default Parser;
