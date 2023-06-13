import { Activity, User } from "../../schema/index.js";
export default async function handler(message) {
  let prevActivity = await this.getActivity(message.activity.target);

  if (prevActivity.type == "Like") {
    await Activity.findOneAndUpdate(
      { _id: prevActivity._id },
      {
        $pull: { "object.likes.items": message.activity.actor },
        $inc: { "object.likes.totalItems": -1 },
      }
    );
  }

  if (prevActivity.type == "Follow") {
    await User.findOneAndUpdate(
      { _id: prevActivity.target },
      {
        $pull: { "actor.followers.items": message.activity.actor },
        $inc: { "actor.followers.totalItems": -1 },
      }
    );
  }

  if (prevActivity.inReplyTo) {
    await Activity.findOneAndUpdate(
      { id: prevActivity.inReplyTo },
      {
        $pull: { "object.replies.items": prevActivity.id },
        $inc: { "object.replies.totalItems": -1 },
      }
    );
  }

  return message;
}
