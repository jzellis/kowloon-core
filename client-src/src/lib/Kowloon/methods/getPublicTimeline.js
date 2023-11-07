export default async function (page) {
  page = page || 1;
  return await this.get(
    `${import.meta.env.VITE_API_SERVER}/outbox?page=${page}`
  );
}
