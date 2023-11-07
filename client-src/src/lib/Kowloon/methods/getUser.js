export default async function (id) {
  const user = await this.get(`${import.meta.env.VITE_API_SERVER}/users/${id}`);
  return user;
}
