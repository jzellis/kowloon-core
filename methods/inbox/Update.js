import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  let _this = this;
  let owner = await User.findOne({ "actor.id": activity.actor });
  // if (this._this.isBlocked(owner, activity.actor)) return _this.sanitize(activity);
  const object = activity.object;
  let result;
  result = await Activity.findOneAndUpdate(
    { "object.id": activity.object.id, owner: owner },
    { $set: { object } }
  );
  activity.result = this._this.sanitize(result);
  return activity;
}
