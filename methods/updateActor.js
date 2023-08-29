import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(actor) {
  try {
    return await Actor.findOneAndUpdate({ id: actor.id }, { $set: actor });
  } catch (e) {
    return { error: e };
  }
}
