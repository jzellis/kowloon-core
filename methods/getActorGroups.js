import Group from "../schema/group.js";

export default async function handler(id, page = 1) {
  return await Groups.find({ members: id })
    .limit(page * 20)
    .skip((page - 1) * 20);
}
