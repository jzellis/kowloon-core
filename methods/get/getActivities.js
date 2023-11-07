export default async function (query) {
  return this.sanitize(await this._getActivities(query));
}
