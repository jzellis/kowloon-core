import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";
import User from "../schema/user.js";

export default async function handler(_id) {
  return await User.findOne({ _id }).populate("actor");
}
