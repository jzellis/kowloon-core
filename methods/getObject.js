export default async function handler(url) {
  let headers = {
    Accept: "application/json. application/activity+json",
    "Application-Type": "application/json",
  };
  if (this.actor) {
    headers.publicKey = this.actor.publicKey;
  }
  return await (
    await fetch(url, {
      method: "GET",
      headers,
    })
  ).json();
}
