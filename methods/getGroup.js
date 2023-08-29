import Group from "../schema/group.js";

export default async function handler(id) {
  let q = { id, deleted: { $exists: false } };
  return (await Group.findOne(q).select("-_id -__v")) || (await this.get(id));
}
