// create verb parser
import {
  Activity,
  Actor,
  Circle,
  Group,
  Post,
  Settings,
  User,
} from "../schema/index.js";
import Schema from "../schema/index.js";

// let Schema = {
//   Activity,
//   Actor,
//   Circle,
//   Group,
//   Post,
//   Settings,
//   User,
// };

export default async function (activity) {
  try {
    let response = {};
    let object;
    let summary;
    let actor = activity.actor && (await Actor.findOne({ id: activity.actor }));
    if (!activity.actor) return { error: new Error("Activity has no actor") };
    if (!activity.object) return { error: new Error("Activity has no object") };

    object = await Post.create(activity.object);
    activity.summary = `${actor?.username} created a new ${
      activity.object.type
    }: ${object.name || object.summary}`;
    activity.object = object.id;
    response.activity = { ...(await Activity.create(activity)), object };

    return response;
  } catch (e) {
    console.error(e);
    return { error: e };
  }
}
