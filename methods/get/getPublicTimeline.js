export default async function (page = 1) {
  let { thePage, total, posts } = await this._getPosts(
    {
      public: true,
      deleted: { $exists: false },
    },
    page
  );
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: `Page ${page} of ${Math.ceil(total / (page * 20))} of ${
      this.settings.title
    }'s Public Timeline`,
    page,
    totalItems: total,
    items: this.sanitize(posts),
  };
}
