// login verb parser
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

  let user = await User.findOne({ username: activity.object.username });
  if (!user) response.error = new Error("User not found");
  if (user && !(await user.verifyPassword(activity.object.password))) {
    response.error = new Error("Wrong password");
  } else {
    response.token = user.accessToken;
  }
  activity.summary = `${user.username} logged in`;
  response.activity = await Activity.create(activity);

  return response;
}
