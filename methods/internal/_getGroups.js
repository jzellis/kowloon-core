/**
 * @namespace kowloon
 */
import { Actor, Group } from "../../schema/index.js";

export default async function handler(
  query,
  options = {
    populate: ["creator", "members", "admins", "moderators"],
    pageLength: 20,
    sort: "createdAt",
  }
) {
  try {
    let groups = await Group.find(query)
      .sort(options.sort)
      .skip((page - 1) * options.pageLength)
      .limit(options.pageLength);

    if (options.populate.length > 0) {
      await Promise.all(
        groups.map(async (group) => {
          if (options.populate.includes("creator"))
            group.creator = await this.sanitize(this.getActor(group.creator));
          if (options.populate.includes("members"))
            group.members = await this.sanitize(
              Actor.find({ id: { $in: group.members } })
            );
          if (options.populate.includes("admins"))
            group.members = await this.sanitize(
              Actor.find({ id: { $in: group.admins } })
            );
          if (options.populate.includes("moderators"))
            group.members = await this.sanitize(
              Actor.find({ id: { $in: group.moderators } })
            );
        })
      );
    }

    return group;
  } catch (error) {
    return { error };
  }
}
