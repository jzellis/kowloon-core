import Group from "../schema/group.js";

export default async function handler(q, page = 1) {
  let limit = 20;
  let offset = limit * (page - 1);
  return await Group.find(q)
    .select.limit(limit)
    .skip(offset)
    .select("-_id -__v");
}
