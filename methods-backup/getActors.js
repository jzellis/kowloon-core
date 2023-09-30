import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(q = {}, page = 1) {
  let limit = 20;
  let offset = (page - 1) * limit;
  q = { ...q, deleted: { $exists: false } };
  return await Actor.find(q)
    .select(
      "id preferredUsername name summary location url icon publicKey -_id"
    )
    .limit(limit)
    .skip(offset)
    .sort({ published: -1 });
}
