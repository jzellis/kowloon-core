// flag verb parser
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
  let actor = await Actor.findOne({ id: activity.actor });
  // Do stuff
  await Post.findOneAndUpdate({ id: activity.target }, { flagged: true });
  activity.summary = `${actor.username} flagged an post`;
  response.activity = await Activity.create(activity);
  return response;
}
