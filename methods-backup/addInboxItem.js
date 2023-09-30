import Inbox from "../schema/inbox.js";

export default async function handler(object) {
  try {
    let post = this.getObjectType(object) == "post" ? object : object.object;
    console.log("Post: ", post);

    if (!post.actor) post.actor = this.actor.id;
    post = await Post.create(post);
    let actor = await this.getActor(post.actor);

    await this.addActivity({
      type: "Create",
      actor: post.actor,
      object: post.id,
      summary: `${actor.id} added a new ${post.type}`,
    });

    return post;
  } catch (e) {
    console.log(e);
    return { error: e };
  }
}
