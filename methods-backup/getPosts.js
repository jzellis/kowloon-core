import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(ids = []) {
  return await Promise.all(
    ids.map(async (id) => {
      return (
        (await Post.findOne({ id }).select("-bto -bcc -_id -__v")) ||
        (await this.get(id))
      );
    })
  );
}
