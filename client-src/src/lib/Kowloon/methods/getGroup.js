export default async function (id) {
  return await this.get(`${import.meta.env.VITE_API_SERVER}/groups/${id}`);
}
