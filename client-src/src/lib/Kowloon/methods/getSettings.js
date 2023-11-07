export default async function () {
  return await this.get(`${import.meta.env.VITE_API_SERVER}`);
}
