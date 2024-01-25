// add verb parser
import {
  Activity,
  Actor,
  Circle,
  Group,
  Post,
  Settings,
  User,
} from "../schema/index.js";

export default async function (activity) {
  const response = {};
  // Do stuff

  if (!activity.actor) return { error: new Error("Activity has no actor") };
  if (!activity.object) return { error: new Error("Activity has no object") };
  if (!activity.target) return { error: new Error("Activity has no target") };

  switch (activity.objectType) {
    case "Circle":
      response.circle = await Circle.findOneAndUpdate(activity.target, {
        $addToSet: {
          members: activity.object,
        },
      });
      break;
    case "Group":
      response.circle = await Group.findOneAndUpdate(activity.target, {
        $addToSet: {
          members: activity.object,
        },
      });
      break;
  }
  response.activity = await Activity.create(activity);

  return response;
}
