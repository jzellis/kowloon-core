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
  let actor = await Actor.findOne({ id: activity.actor });
  let post = await Post.findOne({ id: activity.target });
  activity.summary = `${actor?.username} unliked a ${post?.type}: ${
    post?.name ? post.name : post.summary
  }`;
  try {
    let response = {};
    // Do stuff
    await Post.updateOne(
      { id: activity.target },
      {
        $pull: {
          likes: {
            actor: activity.actor,
          },
        },
      }
    );
    await Actor.updateOne(
      { id: activity.actor },
      {
        $pull: {
          liked: {
            target: activity.target,
          },
        },
      }
    );
    response.activity = await Activity.create(activity);
    return response;
  } catch (e) {
    console.log(e);
  }
}
