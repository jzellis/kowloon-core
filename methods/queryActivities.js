import Activity from "../schema/activity.js";

export default async function handler(criteria = {}, page = 1) {
  return this.sanitize(await Activity.find(criteria))
    .limit(page * 20)
    .skip((page - 1) * 20);
}
