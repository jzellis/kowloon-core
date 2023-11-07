export default async function (id, page = 1) {
  let circle = await this._getCircle(id);
  let { thePage, total, posts } = await this._getPosts(
    { actor: { $in: circle.members }, deleted: { $exists: false } },
    page
  );
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `Page ${page} of ${circle.name} Posts`,
    totalItems: total,
    items: this.sanitize(posts),
  };
}
