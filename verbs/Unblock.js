// like verb parser
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
  let blocker = await Actor.findOne({ id: activity.actor });
  let blocked = await Actor.findOne({ id: activity.target });

  activity.summary = `${blocker?.username} unblocked ${blocked?.username}`;
  try {
    let response = {};
    // Do stuff
    await Actor.findOneAndUpdate(
      { id: blocker.id },
      { $pull: { blocked: blocked.id } }
    );

    response.activity = await Activity.create(activity);
    return response;
  } catch (e) {
    console.log(e);
  }
}
