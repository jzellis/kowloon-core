export default async function (userId) {
  return this.sanitize(await this._getActor(userId));
}
