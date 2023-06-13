import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  await User.findOneAndUpdate(
    { _id: activity.owner },
    {
      $push: { "actor.following.items": activity.object },
      $inc: { "actor.following.totalTtems": 1 },
    }
  );
  if (activity.bto) {
    activity.bto.push(activity.object);
  } else {
    activity.bto = [activity.object];
  }
  activity.result = actor;
  return activity;
}
