import Group from "../schema/group.js";

export default async function handler(criteria = {}, page = 1) {
  let items = await Group.find(criteria)
    .limit(page * 20)
    .skip((page - 1) * 20);

  if (items.length == 1) items = items[0];
  return this.sanitize(items);
}
