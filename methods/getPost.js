import Post from "../schema/post.js";

export default async function handler(id) {
  let post = JSON.parse(await this.redis.get(`posts:${this.hash(id)}`));
  if (!post) {
    let q = { id, deleted: { $exists: false } };
    post = (await Post.findOne(q).select("-_id -__v")) || (await this.get(id));
  }
  return post;
}
