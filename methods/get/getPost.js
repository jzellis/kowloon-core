export default async function (
  id,
  options = { getActor: true, getReplies: true }
) {
  try {
    let populate = [];
    if (options.getActor) populate.push("actor");
    if (options.getReplies) populate.push("replies");
    return this.sanitize(await this._getPost(id, { populate }));
  } catch (error) {
    return { error };
  }
}
