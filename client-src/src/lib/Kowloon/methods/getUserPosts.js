export default async function (id) {
  const posts = await this.get(
    `${import.meta.env.VITE_API_SERVER}/users/${id}/outbox`
  );
  return posts;
}
