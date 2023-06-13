import { Activity, User, Settings } from "../../schema/index.js";
export default async function handler(activity) {
  let original = await getActivity(activity.target);
  if (activity.bto) {
    activity.bto.push(originalactor);
  } else {
    activity.bto = [original.actor];
  }
  return activity;
}
