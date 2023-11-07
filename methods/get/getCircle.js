export default async function (id) {
  return this.sanitize(await this._getCircle(id));
}
