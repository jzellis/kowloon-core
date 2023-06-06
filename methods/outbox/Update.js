import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  let response = await this.fetchGet(activity.object.id);
  let original = await response.json();
  let actor = (await (original.actor && typeof original.actor == "string"))
    ? original.actor
    : original.actor.id;
  if (activity.bto) {
    activity.bto.push(actor);
  } else {
    activity.bto = [actor];
  }
  return activity;
}
