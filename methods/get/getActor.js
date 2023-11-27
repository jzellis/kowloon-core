/**
 * @namespace kowloon
 */
export default async function (userId, options = { populate: [] }) {
  try {
    let actor = await this._getActor(userId, (options = { populate: [] }));
    return this.sanitize(actor);
  } catch (error) {
    console.log(error);
    return { error };
  }
}
