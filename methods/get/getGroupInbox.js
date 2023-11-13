export default async function (id, page = 1, options = { deleted: false }) {
  try {
    let group = await this._getGroup(id);
    let query = { partOf: id };
    if (options.deleted == false) query.deleted = { $exists: false };
    let total = await this._countPosts(query);
    let items = await this._getPosts(query, page);
    return this.sanitize({ page, total, items });
  } catch (error) {
    return { error };
  }
}
