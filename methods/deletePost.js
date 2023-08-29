import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(post) {
  try {
    return await Post.findOneAndUpdate(
      { id: post.id },
      { $set: { formerType: "$type", type: "Tombstone", deleted: Date.now() } }
    );
  } catch (e) {
    return { error: e };
  }
}
