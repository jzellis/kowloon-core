// join verb parser
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
  let group = await Group.findOne({ id: activity.target });
  let list = activity.object;
  let query = {};
  query[list] = { id: actor.id, joinedAt: new Date() };
  // Do stuff
  activity.summary = `${actor?.username} joined the group ${group?.name} ${list}`;
  await Group.findOneAndUpdate({ id: activity.target }, { $push: query });
  response.activity = await Activity.create(activity);
  return response;
}
