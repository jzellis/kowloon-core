import { Actor, Group } from "../../schema/index.js";

export default async function handler(
  _id,
  options = { populate: ["creator", "members", "admins", "moderators"] }
) {
  try {
    let groups = await Group.find({
      $or: [{ _id: { $in: ids } }, { id: { $in: ids } }],
    });
    if (options.populate.length > 0) {
      await Promise.all(
        groups.map(async (group) => {
          if (options.populate.includes("creator"))
            group.creator = await this.getActor(group.creator);
          if (options.populate.includes("members"))
            group.members = await Actor.find({ id: { $in: group.members } });
          if (options.populate.includes("admins"))
            group.members = await Actor.find({ id: { $in: group.admins } });
          if (options.populate.includes("moderators"))
            group.members = await Actor.find({ id: { $in: group.moderators } });
        })
      );
    }

    return group;
  } catch (error) {
    return { error };
  }
}
