import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  await User.findOneAndUpdate(
    { _id: activity.owner },
    {
      $push: {
        "actor.liked.items": activity.target,
      },
      $inc: {
        "actor.liked.totelItems": 1,
      },
    }
  );
  return activity;
}
