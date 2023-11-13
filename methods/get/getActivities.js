export default async function (
  query = {},
  page = 1,
  options = { deleted: false }
) {
  try {
    if (options.deleted == false) query.deleted = { $exists: false };
    let items = this.sanitize(await this._getActivities(query, page));
    let total = await this._countActivities(query);
    return { page, total, items };
  } catch (error) {
    return { error };
  }
}
