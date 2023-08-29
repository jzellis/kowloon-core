import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Outbox from "../schema/outbox.js";
import Post from "../schema/post.js";

export default async function handler(object) {
  try {
    let post = this.getObjectType(object) == "post" ? object : object.object;
    post = await Post.create(post);
    let activity =
      this.getObjectType(object) == "activity"
        ? object
        : {
            type: "Create",
            actor: post.actor,
            post,
          };

    activity = await this.addActivity(activity);

    return activity;
  } catch (e) {
    return { error: e };
  }
}
