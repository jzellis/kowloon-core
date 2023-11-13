import { Post } from "../../schema/index.js";

export default async function (query) {
  return await Post.countDocuments(query);
}
