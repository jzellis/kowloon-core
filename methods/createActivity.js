import Activity from "../schema/activity.js";

export default async function handler(activity) {
  const newActivity = new Activity(activity);
  const error = newActivity.validateSync();
  if (error) {
    return error;
  } else {
    await newActivity.save();
    return newActivity;
  }
}
