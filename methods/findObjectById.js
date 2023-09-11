import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Group from "../schema/group.js";
import Post from "../schema/post.js";

export default async function handler(id) {
  let result = {};
  result = await Actor.findOne(id);
  if (!result) result = await Activity.findOne(id);
  if (!result) result = await Post.findOne(id);
  if (!result) result = await Group.findOne(id);
}
