export default async function handler(url) {
  let options = { method: "GET" };
  if (this.user)
    options.headers = { authorization: `Bearer ${this.user.accessToken}` };
  return await fetch(url, options);
}
