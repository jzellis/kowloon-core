// accept verb parser
import {
  Activity,
  Actor,
  Circle,
  Group,
  Post,
  Settings,
  User,
} from "../schema/index.js";

export default async (activity) => {
  let response = {};
  // Do stuff
  response.activity = await Activity.create(activity);
  return response;
};
