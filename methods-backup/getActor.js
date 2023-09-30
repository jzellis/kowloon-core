import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(id) {
  let actor = JSON.parse(await this.redis.get(`actors:${this.hash(id)}`));
  if (!actor) {
    let q = { id, deleted: { $exists: false } };
    actor = await Activity.findOne(q).select(
      "id preferredUsername name summary location url icon publicKey -_id"
    );
  }
  return actor;
}
