import { Activity, User } from "../../schema/index.js";
export default async function handler(message) {
  await User.findOneAndUpdate(
    { id: message.activity.target },
    {
      $push: { "actor.followers.items": message.from },
      $inc: { "actor.followers.items": 1 },
    }
  );

  return message;
}
