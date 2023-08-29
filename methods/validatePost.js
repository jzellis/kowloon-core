import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";

export default function handler(post) {
  switch (true) {
    case !post.actor:
      return new Error("No actor specified");
      break;
  }

  return true;
}
