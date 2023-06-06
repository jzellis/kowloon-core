import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  await User.findOneAndUpdate(
    { _id: activity.owner },
    {
      $push: {
        "actor.liked.items": activity.object,
      },
      $inc: {
        "actor.liked.totelItems": 1,
      },
    }
  );

  let response = await this.fetchGet(activity.target);
  let original = await response.json();
  let actor = (await (original.actor && typeof original.actor == "string"))
    ? original.actor
    : original.actor.id;
  if (activity.bto) {
    activity.bto.push(actor);
  } else {
    activity.bto = [actor];
  }
  activity.result = response;
  return activity;
}
