import Post from "../schema/post.js";

export default async function handler(id, page = 1) {
  return await Post.find({ actor: id })
    .sort("-published")
    .limit(page * 20)
    .skip((page - 1) * 20);
}
