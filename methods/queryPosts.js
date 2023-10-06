import Post from "../schema/post.js";

export default async function handler(criteria = {}, page = 1) {
  console.log(criteria);
  let posts = await Post.find(criteria)
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
