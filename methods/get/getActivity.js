export default async function (id) {
  try {
    return this.sanitize(await this._getActivity(id));
  } catch (error) {
    return { error };
  }
}
