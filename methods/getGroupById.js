import Group from "../schema/group.js";

export default async function handler(id) {
  return this.sanitize(await Group.findOne({ _id: id }));
}
