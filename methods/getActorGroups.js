import Group from "../schema/group.js";

export default async function handler(id) {
  return await Group.findOne({ members: id });
}
