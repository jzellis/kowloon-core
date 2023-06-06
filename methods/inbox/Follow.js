import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  let result = await User.findOneAndUpdate(
    { "actor.id": activity.object },
    {
      $push: { "actor.followers.items": activity.actor },
      $inc: { "actor.followers.totalItems": 1 },
    }
  );
  activity.result = this._this.sanitize(result);
  return activity;
}
