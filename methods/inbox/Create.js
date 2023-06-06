import { Activity, User } from "../../schema/index.js";
export default async function handler(activity) {
  let result;
  if (activity.object.inReplyTo)
    result = await Activity.findOneAndUpdate(
      {
        "object.id": activity.object.inReplyTo,
      },
      {
        $push: {
          "object.replies.items": {
            ...activity.object,
            attributedTo: activity.actor,
            actor: activity.actor,
          },
        },

        $inc: {
          "object.replies.totalItems": 1,
        },
      },
      { new: true }
    );
  activity.result = this._this.sanitize(result) || undefined;
  return activity;
}
