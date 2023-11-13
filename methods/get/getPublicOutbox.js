export default async function (
  actorId = null,
  page,
  options = { type: "posts", deleted: false }
) {
  try {
    let items, total;
    options.type == ["posts", "activities"].includes(options.type)
      ? options.type
      : "posts";
    let query = {
      public: true,
    };
    if (actorId != null) {
      let actor = await this._getActor(actorId);
      query.actor = { $nin: actor.blocked };
    }
    if (options.deleted == false) query.deleted = { $exists: false };

    if (options.type === "posts") {
      total = await this._countPosts(query);
      items = await this._getPosts(query, page);
    } else {
      total = await this._countActivities(query);
      items = await this._getActivities(query, page);
    }
    return this.sanitize({ page, total, items });
  } catch (error) {
    return { error };
  }
}
