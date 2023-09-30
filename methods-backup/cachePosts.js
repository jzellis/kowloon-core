import Post from "../schema/post.js";

export default async function handler() {
  await this.redis.del("posts");
  let posts = await Post.find({
    published: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) },
  }).select("-_id -__v");
  await Promise.all(
    posts.map(async (post) => {
      await this.redis.SET(`posts:${this.hash(post.id)}`, JSON.stringify(post));
    })
  );
}
