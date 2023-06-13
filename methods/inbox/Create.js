import { Activity, User } from "../../schema/index.js";
export default async function handler(message) {
  if (message.activity && message.activity.inReplyTo) {
    await Activity.findOneAndUpdate(
      { "object.id": message.activity.inReplyTo },
      {
        $push: { "object.replies.items": message.activity.id },
        $inc: { "object.replies.totalItems": 1 },
      }
    );
  }

  return message;
}
