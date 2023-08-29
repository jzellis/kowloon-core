import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Group from "../schema/group.js";
import Post from "../schema/post.js";

export default async function handler(group) {
  try {
    group = await Group.create(group);
    await Activity.create({
      actor: group.creator,
      type: "Create",
      object: group.id,
      public: group.public,
    });
    return group;
  } catch (e) {
    return { error: e };
  }
}
