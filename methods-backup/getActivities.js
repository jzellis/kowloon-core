import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(q = {}, page = 1) {
  let limit = 20;
  let offset = (page - 1) * limit;
  let activities = await Activity.find(q)
    .limit(limit)
    .skip(offset)
    .sort({ published: -1 })
    .select("-bto -bcc -_id -__v");

  await Promise.all(
    activities.map(async (activity) => {
      if (typeof activity.object == "string")
        activity.object =
          (await Post.findOne({ id: activity.object }).select(
            "-bto -bcc -_id -__v"
          )) || (await this.get(activity.object));
    })
  );
  return activities;
}
