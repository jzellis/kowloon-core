import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(user) {
  try {
    return await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { ...user, isAdmin: false } }
    );
  } catch (e) {
    return { error: e };
  }
}
