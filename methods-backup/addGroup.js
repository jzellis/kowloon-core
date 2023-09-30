import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(group) {
  try {
    return group;
  } catch (e) {
    return { error: e };
  }
}
