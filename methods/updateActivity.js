import { Activity } from "../schema/index.js";

export default async function handler(activity) {
  await Activity.findOneAndUpdate({ id: activity.id }, activity, { new: true });
}
