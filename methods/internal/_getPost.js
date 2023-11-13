import { Post } from "../../schema/index.js";

export default async function handler(
  _id,
  options = { populate: ["actor", "replies"] }
) {
  try {
    let post = await Post.findOne({ $or: [{ _id }, { id: _id }] });
    if (options.populate.length > 0) {
      if (options.populate.includes("actor"))
        post.actor = await this.getActor(post.actor);
      if (options.populate.includes("replies"))
        post.replies = await Post.find({ id: { $in: post.replies } });
    }
    return post;
  } catch (error) {
    return { error };
  }
}
