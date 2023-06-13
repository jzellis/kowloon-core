import { Activity, User } from "../../schema/index.js";
export default async function handler(message) {
  let owner = await User.findOne({ id: message.from });
  await Activity.findOneAndUpdate(
    { id: message.activity.object, owner: owner._id },
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
  return message;
}
