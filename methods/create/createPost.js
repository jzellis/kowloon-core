export default async function (post) {
  const regex = new RegExp("^[aeiou].*", "i");
  const actor = await this._getActor(post.actor);
  let summary = `${actor.name} created ${
    post.object.type.test(regex) ? "an" : "a"
  } ${post.object.type}${post.title ? ": " + post.title : ""}`;
  return this.sanitize(
    await this.createActivity({
      type: "Create",
      actor: post.actor,
      object: post,
      public: post.public,
      to: post.to,
      cc: post.cc,
      bto: post.bto,
      bcc: post.bcc,
      summary,
    })
  );
}
