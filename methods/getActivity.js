import Activity from "../schema/activity.js";
import Post from "../schema/post.js";

export default async function handler(id) {
  let activity = JSON.parse(
    await this.redis.get(`activities:${this.hash(id)}`)
  );
  if (!activity) {
    let q = { id, deleted: { $exists: false } };
    activity = await Activity.findOne(q).select("-_id -__v");
  }
  if (typeof activity.object == "string")
    activity.object =
      (await Post.findOne({ id: activity.object }).select(
        "-bto -bcc -_id -__v"
      )) || (await this.get(activity.object));
  return activity;
}
