import { Activity } from "../../schema/index.js";
export default async function handler(_id) {
  try {
    let activity = await Activity.findOne({ $or: [{ _id }, { id: _id }] });
    activity.actor = await this.getActor(activity.actor);

    return activity;
  } catch (error) {
    return { error };
  }
}
