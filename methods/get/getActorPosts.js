export default async function (userId, page = 1) {
  let actor = await this.sanitize(this._getActor(userId));
  let query = {
    actor: actor.id,
    deleted: { $exists: false },
  };
  if (this.user && this.user.id) {
    query.$or = [
      { public: true },
      { to: this.user.actor.id },
      { cc: this.user.actor.id },
      { bto: this.user.actor.id },
      { bcc: this.user.actor.id },
    ];
  } else {
    query.public = true;
  }
  console.log("Query: ", query);
  let { thePage, total, posts } = await this._getPosts(query, page);
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `Page ${page} of ${actor.name} Posts`,
    totalItems: total,
    items: this.sanitize(posts),
  };
}
