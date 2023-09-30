import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(q, page = 1) {
  let limit = 20;
  let offset = limit * (page - 1);
  return await Actor.find(q)
    .select.limit(limit)
    .skip(offset)
    .select(
      "id preferredUsername name summary location url icon publicKey -_id"
    );
}
