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
  activity.summary = `${actor?.username} left the group ${group?.name}`;
  await Group.findOneAndUpdate(
    { id: activity.target },
    { $pull: { members: { id: actor.id } } }
  );
  response.activity = await Activity.create(activity);
  return response;
}
