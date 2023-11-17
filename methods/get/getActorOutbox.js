/**
 * @namespace kowloon
 */
export default async function (
  actorId,
  page,
  options = { type: "posts", publicOnly: true, deleted: false }
) {
  try {
    let actor = await this._getActor(actorId);
    let items, total;
    options.type == ["posts", "activities"].includes(options.type)
      ? options.type
      : "posts";
    let query = {
      actor: actorId,
    };
    if (options.publicOnly == true) {
      query.public = true;
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
