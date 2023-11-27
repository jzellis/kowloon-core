/**
 * @namespace kowloon
 */
import { Activity } from "../../schema/index.js";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
export default async function handler(id) {
  try {
    let query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
    let activity = await Activity.findOne(query);
    if (activity) activity.actor = await this.getActor(activity.actor);

    return activity;
  } catch (error) {
    return { error };
  }
}
