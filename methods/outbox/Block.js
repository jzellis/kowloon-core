import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  // This should just block the object and return nothing at all
  let result = await User.findOneAndUpdate(
    { id: activity.actor.id },
    { $push: { "actor.blocked.items": activity.object } }
  );
  activity.to = activity.bto = activity.cc = activity.bcc = [];
  return activity;
}
