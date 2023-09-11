import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(q, page = 1) {
  let limit = 20;
  let offset = limit * (page - 1);
  let activities = await Activity.find(q)
    .limit(limit)
    .skip(offset)
    .select("-bto -bcc -_id -__v");

  return await Promise.all(
    activities.map(async (activity) => {
      if (activity.object) activity.post = await this.getPost(activity.object);
      return activity;
    })
  );
}
