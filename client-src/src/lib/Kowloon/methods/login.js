export default async function handler(username, password) {
  return await (
    await fetch(`${import.meta.env.VITE_API_SERVER}/login`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ username, password }),
    })
  ).json();
}
