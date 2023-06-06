import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  await User.findOneAndUpdate(
    { _id: activity.owner },
    {
      $push: { "actor.following.items": activity.object },
      $pull: { "actor.following.totalTtems": 1 },
    }
  );
  let response = await this.fetchGet(activity.object);
  let actor = await response.json();
  if (activity.bto) {
    activity.bto.push(activity.object);
  } else {
    activity.bto = [activity.object];
  }
  activity.result = actor;
  return activity;
}
