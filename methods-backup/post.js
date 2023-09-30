import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(url, body) {
  body = body || {};
  return await (
    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json. application/activity+json",
        "Application-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  ).json();
}
