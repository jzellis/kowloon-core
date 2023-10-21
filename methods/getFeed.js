import Feed from "../schema/post.js";

export default async function handler(id) {
  return Feed.findOne({ id });
}
