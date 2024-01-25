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
    // if(!activity.actor) return {error: new Error("Activity has no actor")}
    if (!activity.object) return { error: new Error("Activity has no object") };

    object = await Schema[activity.objectType].create(activity.object);

    switch (activity.objectType) {
      case "Actor":
        activity.summary = `${activity.object.username} (${activity.object.username}) joined the server`;
        break;

      case "User":
        activity.summary = `Created User ${activity.object.username}`;
        break;

      case "Circle":
        activity.summary = `${actor?.username} created a new Circle: ${activity.object.name}`;
        break;

      case "Group":
        activity.summary = `${actor?.username} created a new Group: ${activity.object.name}`;
        break;

      case "Post":
        activity.summary = `${actor?.username} created a new ${
          activity.object.type
        }: ${object.name || object.summary}`;
        break;

      case "Setting":
        activity.summary = `${actor?.username} created a new Setting: ${activity.object.name}`;

        break;
    }
    activity.object = object.id;
    response.activity = { ...(await Activity.create(activity)), object };

    return response;
  } catch (e) {
    console.error(e);
    return { error: e };
  }
}
