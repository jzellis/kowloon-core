import Post from "../schema/post.js";

export default async function handler(id, page = 1) {
  return this.sanitize(
    await Post.findOne({
      $or: [{ to: id }, { cc: id }, { bto: id }, { bcc: id }],
    })
  )
    .sort("-published")
    .limit(page * 20)
    .skip((page - 1) * 20);
}
