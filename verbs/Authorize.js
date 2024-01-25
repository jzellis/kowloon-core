// authorize verb parser
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
  let response = {};
  if (!activity.object) return { error: new Error("Missing object") };
  if (!activity.object.token) return { error: new Error("Missing token") };
  let user = await User.findOne({ accessToken: activity.object.token });
  response = user ? { user } : { error: new Error("Invalid token") };
  response.activity = await Activity.create(activity);

  return response;
}
