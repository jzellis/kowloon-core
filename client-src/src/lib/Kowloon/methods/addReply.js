export default async function (post) {
  return await this.post(
    `${import.meta.env.VITE_API_SERVER}/posts/${post.replyTo}/replies`,
    post
  );
}
