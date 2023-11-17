/**
 * @namespace kowloon
 */
import { Actor, Group } from "../../schema/index.js";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
export default async function handler(id, options = { populate: [] }) {
  try {
    let query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
    let group = await Group.findOne(query);
    if (options.populate.length > 0) {
      if (options.populate.includes("creator"))
        group.creator = await this.getActor(group.creator);
      if (options.populate.includes("members"))
        group.members = await Actor.find({ id: { $in: group.members } });
      if (options.populate.includes("admins"))
        group.members = await Actor.find({ id: { $in: group.admins } });
      if (options.populate.includes("moderators"))
        group.members = await Actor.find({ id: { $in: group.moderators } });
    }

    return group;
  } catch (error) {
    console.error(error);
    // return { error };
  }
}
