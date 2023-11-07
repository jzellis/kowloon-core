export default async function (id, page = 1) {
  let group = await this._getGroup(id);
  let { thePage, total, posts } = await this._getPosts(
    { partOf: id, deleted: { $exists: false } },
    page
  );
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `Page ${page} of ${group.name} Posts`,
    totalItems: total,
    items: this.sanitize(posts),
  };
}
