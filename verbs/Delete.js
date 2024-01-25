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
    // if (!activity.actor) return { error: new Error("Activity has no actor") };

    try {
      object = await Schema[activity.objectType].findOneAndUpdate(
        { id: activity.target },
        {
          originalType: $type,
          type: "Tombstone",
          deleted: new Date(),
        }
      );
    } catch (e) {
      console.log(e);
    }

    switch (activity.objectType) {
      case "Actor":
        activity.summary = `${actor?.username} deleted themselves`;
        break;

      case "User":
        activity.summary = `Created User ${activity.object.username}`;
        break;

      case "Circle":
        activity.summary = `${actor?.username} deleted a Circle`;
        break;

      case "Group":
        activity.summary = `${actor?.username} deleted a Group`;
        break;

      case "Post":
        activity.summary = `${actor?.username} deleted a Post`;
        break;

      case "Setting":
        activity.summary = `${actor?.username} deleted a Setting`;

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
