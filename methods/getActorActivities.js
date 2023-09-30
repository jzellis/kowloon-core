import Activity from "../schema/activity.js";

export default async function handler(id, page = 1) {
  return await Activity.findOne({ actor: id })
    .limit(page * 20)
    .skip((page - 1) * 20);
}
