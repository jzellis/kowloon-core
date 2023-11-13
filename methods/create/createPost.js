import { Group } from "../../schema/index.js";

export default async function (post) {
  try {
    const regex = new RegExp("^[aeiou].*", "i");
    const actor = await this._getActor(post.actor);
    let activity = {
      type: "Create",
      actor: post.actor,
      object: post,
      objectType: "Post",
      public: post.public,
      to: post.to,
      cc: post.cc,
      bto: post.bto,
      bcc: post.bcc,
    };
    if (!post.type) return new Error("Post type is required");

    let summary = `${actor.name} created ${
      regex.test(post.type) ? "an" : "a"
    } ${post.type}${post.title ? ": " + post.title : ""}`;
    if (post.partOf) {
      activity.partOf = post.partOf;
      let group = await this._getGroup(post.partOf);
      summary += ` in ${group.name}`;
      activity.to = activity.to
        ? Array.from(new Set([...activity.to, ...group.members]))
        : [...group.members];
      activity.public = group.public;
    }
    if (post.public) {
      post.to = post.to
        ? Array.from(new Set([...post.to, ...actor.following]))
        : [...actor.following];
      activity.to = post.to;
    }
    activity.summary = summary;
    return this.sanitize(await this.createActivity(activity));
  } catch (error) {
    console.error(error);
    return { error };
  }
}
