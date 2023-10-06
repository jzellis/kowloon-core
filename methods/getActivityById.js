import Activity from "../schema/activity.js";

export default async function handler(id) {
  let activity = await Activity.findOne({ _id: id });
  activity.actor = await this.getActorById(activity.actor);
  return activity;
}
