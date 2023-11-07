export default async function (id) {
  return this.sanitize(await this._getActivity(id));
}
