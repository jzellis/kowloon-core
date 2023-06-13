import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  let original = await this.getActivity(activity.target);
  if (activity.bto) {
    activity.bto.push(actor);
  } else {
    activity.bto = [actor];
  }
  return activity;
}
