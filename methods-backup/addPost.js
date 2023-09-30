import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Outbox from "../schema/outbox.js";
import Post from "../schema/post.js";

export default async function handler(object) {
  try {
    let post = this.getObjectType(object) == "post" ? object : object.object;

    if (!post.actor) post.actor = this.actor.id;
    let actor = await Actor.findOne({ id: post.actor });

    if (actor && post.public === true) post.cc = actor.followers;
    post = await Post.create(post);

    await this.addActivity({
      type: "Create",
      actor: post.actor,
      object: post.id,
      summary: `${post.actor} added a new ${post.type}`,
      to: post.to,
      cc: post.cc,
      bto: post.bto,
      bcc: post.bcc,
    });

    return post;
  } catch (e) {
    console.log(e);
    return { error: e };
  }
}
