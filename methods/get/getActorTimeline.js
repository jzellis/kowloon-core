export default async function (id, page = 1) {
  let actor = await this._getActor(id);
  let { thePage, total, posts } = await this._getPosts(
    {
      $or: [{ actor: id }, { to: id }, { cc: id }, { bto: id }, { bcc: id }],
      deleted: { $exists: false },
    },
    page
  );
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `Page ${page} of ${actor.name}'s Timeline`,
    totalItems: total,
    items: this.sanitize(posts),
  };
}
