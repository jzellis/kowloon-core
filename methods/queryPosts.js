import Post from "../schema/post.js";

export default async function handler(criteria) {
  return this.sanitize(await Post.find(criteria));
}
