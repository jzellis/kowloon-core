import Post from "../schema/post.js";

export default async function handler(id) {
  return await Post.findOne({ id });
}
