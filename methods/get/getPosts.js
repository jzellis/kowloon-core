export default async function (
  query,
  page = 1,
  options = { deleted: false, getActors: true, getReplies: true }
) {
  try {
    if (options.deleted == false) query.deleted = { $exists: false };
    let populate = [];
    if (options.getActors) populate.push("actor");
    if (options.getReplies) populate.push("replies");

    let items = await this._getPosts(query, page, { populate });
    let total = await this._countPosts(query);
    return this.sanitize({ page, total, items });
  } catch (error) {
    return { error };
  }
}
