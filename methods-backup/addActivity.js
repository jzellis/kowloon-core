import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";
import Outbox from "../schema/outbox.js";
import Inbox from "../schema/inbox.js";

export default async function handler(activity) {
  try {
    activity = await Activity.create(activity);
    return activity;
  } catch (e) {
    return { error: e };
  }
}
