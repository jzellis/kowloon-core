/**
 * @namespace kowloon
 */
export default async function (userId) {
  try {
    let actor = await this._getActor(userId);
    return this.sanitize(actor);
  } catch (error) {
    console.log(error);
    return { error };
  }
}
