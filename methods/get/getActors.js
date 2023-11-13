export default async function (query, page = 1, options = { deleted: false }) {
  try {
    if (options.deleted == false) query.deleted = { $exists: false };
    let items = await this._getActors(query, page);
    let total = await this._countActors(query);
    return { page, total, items };
  } catch (error) {
    return { error };
  }
}
