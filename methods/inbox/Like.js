import { Activity, User } from "../../schema/index.js";
export default async function handler(message) {
  console.log("Inbox Liked Message: ", message);
  await Activity.findOneAndUpdate(
    { "object.id": message.activity.target },
    {
      $push: { "object.likes.items": message.activity.actor },
      $inc: { "object.likes.totalItems": 1 },
    }
  );

  return message;
}
