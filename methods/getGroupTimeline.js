import Post from "../schema/post.js";

export default async function handler(id, page = 1) {
  return await Post.findOne({ $or: [{ to: id }, { cc: id }] })
    .sort("-published")
    .limit(page * 20)
    .skip((page - 1) * 20);
}
