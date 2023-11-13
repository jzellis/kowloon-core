export default async function (id) {
  try {
    return this.sanitize(await this._getGroup(id));
  } catch (error) {
    return { error };
  }
}
