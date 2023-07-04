import { Activity, User, Settings, Inbox } from "../../schema/index.js";
export default async function handler(activity) {
  return await Inbox.findOneAndUpdate(
    { "activity.id": activity.target },
    {
      $set: { read: true },
    }
  );
  return activity;
}
