export default async function (url) {
  return await this.get(
    `${import.meta.env.VITE_API_SERVER}/preview?url=${url}`
  );
}
