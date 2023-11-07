export default async function (user, page) {
  page = page || 1;
  return await this.get(
    `${import.meta.env.VITE_API_SERVER}/${user}/outbox?page=${page}`
  );
}
