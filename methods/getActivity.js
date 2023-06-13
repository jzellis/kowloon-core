import { Activity } from "../schema/index.js";
export default async function handler(id) {
  let activity = await Activity.findOne({ "object.id": id });
  if (!activity) activity = await (await fetch(id)).json();
  return activity;
}
