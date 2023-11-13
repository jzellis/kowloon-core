export default async function (
  actorId,
  page,
  options = { type: "posts", actorPosts: true, deleted: false }
) {
  try {
    let actor = await this._getActor(actorId);
    let items, total;
    options.type == ["posts", "activities"].includes(options.type)
      ? options.type
      : "posts";

    let query = {
      actor: { $nin: actor.blocked },
      $or: [
        { to: actorId },
        { cc: actorId },
        { bto: actorId },
        { bcc: actorId },
      ],
    };
    if (options.actorPosts == true) {
      query.$or.push({ actor: actorId });
    }
    if (options.deleted == false) query.deleted = { $exists: false };
    if (options.type === "posts") {
      total = await this._countPosts(query);
      items = await this._getPosts(query, page);
    } else {
      total = await this._countActivities(query);
      items = await this._getActivities(query, page);
    }
    items = this.sanitize(items);
    return { page, total, items };
  } catch (error) {
    return { error };
  }
}
