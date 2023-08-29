import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(url) {
  return await (
    await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json. application/activity+json",
        "Application-Type": "application/json",
      },
    })
  ).json();
}
