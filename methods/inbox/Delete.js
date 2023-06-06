import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  let deletedActivity = await Activity.findOne({
    id: activity.object,
    actor: activity.actor,
  });
  let formerType =
    deletedActivity.object && deletedActivity.object.type
      ? deletedActivity.object.type
      : null;
  let deleted = new Date();
  deleted = deleted.toISOString();
  let result = await Activity.findOneAndUpdate(
    { id: activity.object, actor: activity.actor },
    {
      $set: {
        object: {
          type: "Tombstone",
          formerType,
        },
        deleted,
      },
    }
  );
  activity.result = this._this.sanitize(result);
  return activity;
}
