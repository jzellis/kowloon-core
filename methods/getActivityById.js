import Activity from "../schema/activity.js";

export default async function handler(id) {
  return await Activity.findOne({ id });
}
