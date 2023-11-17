/**
 * @namespace kowloon
 */
export default async function (userId) {
  try {
    return this.sanitize(await this._getActor(userId));
  } catch (error) {
    return { error };
  }
}
