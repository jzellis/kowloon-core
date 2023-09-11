import { PorterStemmer } from "natural";
import Post from "../schema/post.js";

export default async function handler(id) {
  let post = JSON.parse(await this.redis.get(`posts:${this.hash(id)}`));
  if (!post) {
    let q = { id, deleted: { $exists: false } };
    post = (await Post.findOne(q).select("-_id -__v")) || (await this.get(id));
  }
  if (!post) {
    post = await this.get(id);
  }
  post.actor = await this.getActor(post.actor);
  if (post.replies.length > 0) {
    replies = post.replies;
    post.replies = await Promise.all(
      replies.map(async (reply) => {
        this.getPost(reply);
      })
    );
  }
  return post;
}
