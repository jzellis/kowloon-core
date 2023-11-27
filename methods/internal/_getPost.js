/**
 * @namespace kowloon
 */
import { Post } from "../../schema/index.js";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
export default async function handler(
  id,
  options = { populate: ["actor", "replies"] }
) {
  try {
    let query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };

    let post = await Post.findOne(query);
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
