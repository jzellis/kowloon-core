import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  const object =
    activity.object && typeof activity.object == "object" && activity.object.id
      ? activity.object.id
      : activity.object;
  let published = new Date();
  const liked = await Activity.findOneAndUpdate(
    {
      id: activity.target,
    },
    {
      $push: {
        "object.likes.items": {
          ...activity.object,
          published: published.toISOString(),
        },
      },

      $inc: {
        "object.likes.totalItems": 1,
      },
    },
    { new: true }
  );
  activity.result = this._this.sanitize(liked);
  return activity;
}
