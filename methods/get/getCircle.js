/**
 * @namespace kowloon
 */
export default async function (id) {
  try {
    return this.sanitize(await this._getCircle(id));
  } catch (error) {
    return { error };
  }
}
