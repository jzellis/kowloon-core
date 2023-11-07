export default async function handler(url) {
  return await (
    await fetch(url, {
      headers: this.headers(),
    })
  ).json();
}
