import { Activity } from "../schema/index.js";

export default async function handler(activity) {
  activity.owner = activity.owner ? activity.owner : this.user._id;
  if (!activity.owner) return new Error("No owner specified");
  let user = await User.findOne({ _id: activity.owner });
  let blockedUsers = user.actor.blocked.items;
  if (blockedUsers.indexOf(activity.actor) == -1)
    return this.sanitize(await Activity.create(activity));
}
