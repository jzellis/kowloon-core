export default async function handler(url, body) {
  let headers = {
    Accept: "application/json. application/activity+json",
    "Application-Type": "application/json",
  };
  if (this.actor) {
    headers.publicKey = this.actor.publicKey;
  }
  return await (
    await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
  ).json();
}
