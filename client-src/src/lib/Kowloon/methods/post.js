export default async function (url, body) {
  return await (
    await fetch(url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    })
  ).json();
}
