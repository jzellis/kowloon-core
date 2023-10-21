import Post from "../schema/post.js";

export default async function handler(criteria = {}, page = 1) {
  let posts = await Post.find(criteria)
    .sort({ published: -1 })
    .limit(page * 20)
    .skip((page - 1) * 20);
  await Promise.all(
    posts.map(async (post) => {
      post.actor = await this.getActorById(post.actor);
      post.attributedTo =
        post.attributedTo == post.actor
          ? post.actor
          : await this.getActorById(post.attributedTo);
      return post;
    })
  );

  if (posts.length == 1) posts = posts[0];

  return this.sanitize(posts);
}
