import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(id) {
  try {
    return await Actor.findOneAndUpdate(
      { id: actor.id },
      { $set: { formerType: "Actor", type: "Tombstone", deleted: Date.now() } }
    );
  } catch (e) {
    return { error: e };
  }
}
