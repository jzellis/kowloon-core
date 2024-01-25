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
  activity.summary = `${actor?.username} unbookmarked a ${post?.type}: ${
    post?.name ? post.name : post.summary
  }`;
  try {
    let response = {};
    // Do stuff

    await Actor.findOneAndUpdate(
      { id: activity.actor },
      {
        $pull: {
          bookmarked: activity.target,
        },
      }
    );
    response.activity = await Activity.create(activity);
    return response;
  } catch (e) {
    console.log(e);
  }
}
