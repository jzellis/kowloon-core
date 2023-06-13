import { Activity, User } from "../../schema/index.js";
export default async function handler(message) {
  await Activity.findOneAndUpdate(
    { id: message.activity.id, owner: this.user._id },
    {
      $set: {
        "object.name": message.activity.object.name,
        "object.content": message.activity.object.content,
        "object.tags": message.activity.object.tags,
        "object.url": message.activity.object.url,
        "object.image": message.activity.object.image,
      },
    }
  );

  //   if (["Application", "Group", "Organization", "Person", "Service"].indexOf(message.activity.object.type) >= 0) {
  //   await User.findOneAndUpdate({id: message.})
  // }

  return message;
}
