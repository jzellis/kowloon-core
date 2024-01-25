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
  // Do stuff
  activity.summary = `${actor?.username} joined the group ${group?.name}`;
  await Group.findOneAndUpdate(
    { id: activity.target },
    { $push: { members: { id: actor.id, joinedAt: new Date() } } }
  );
  response.activity = await Activity.create(activity);
  return response;
}
