export default async function (id) {
  return this.sanitize(await this._getPost(id));
}
