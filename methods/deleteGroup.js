import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";
import Group from "../schema/group.js";

export default async function handler(id) {
  try {
    return await Group.findOneAndUpdate(
      { id: group.id },
      { $set: { formerType: "Group", type: "Tombstone", deleted: Date.now() } }
    );
  } catch (e) {
    return { error: e };
  }
}
