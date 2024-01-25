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
  let follower = await Actor.findOne({ id: activity.actor });
  let followed = await Actor.findOne({ id: activity.target });
  let followerCircle = await Circle.findOne({ _id: follower.following });
  let followedCircle = await Circle.findOne({ _id: followed.followers });

  activity.summary = `${follower?.username} followed ${followed?.username}`;
  try {
    let response = {};
    // Do stuff
    await Circle.updateOne(
      { _id: followerCircle._id },
      {
        $push: { members: activity.target },
      }
    );
    await Circle.updateOne(
      { _id: followedCircle._id },
      {
        $push: { members: activity.actor },
      }
    );

    response.activity = await Activity.create(activity);
    return response;
  } catch (e) {
    console.log(e);
  }
}
