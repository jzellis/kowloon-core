import {
  Activity,
  Actor,
  Circle,
  Group,
  Post,
  User,
} from "../../schema/index.js";

export default async function (activity) {
  let response = {};
  switch (activity.type) {
    case "Create":
      switch (true) {
        case activity.object.type == "Actor":
          response.actor = await Actor.create(activity.object);
          activity.object = response.actor.id;
          activity.objectType = "Actor";
          break;
        case activity.object.type == "Circle":
          response.circle = await Circle.create(activity.object);
          activity.object = response.circle.id;
          activity.objectType = "Circle";
          break;
        case activity.object.type == "Group":
          response.group = await Group.create(activity.object);
          activity.object = response.group.id;
          activity.objectType = "Group";

          break;
        case this.postTypes.includes(activity.object.type):
          response.post = await Post.create(activity.object);
          activity.object = response.post.id;
          activity.objectType = "Post";
          break;
        default:
          break;
      }
      break;
    case "Update":
      switch (true) {
        case this.postTypes.includes(activity.object.type):
          response.post = await Post.findOneAndUpdate(
            { id: activity.target, actor: activity.actor },
            { $set: activity.object }
          );
          activity.object = response.post.id;
          activity.objectType = "Post";

          break;
        case activity.object.type == "Actor":
          response.actor = await Actor.findOneAndUpdate(
            { id: activity.target },
            { $set: activity.object }
          );
          activity.object = response.actor.id;
          activity.objectType = "Actor";

          break;
        case activity.object.type == "Circle":
          response.circle = await Circle.findOneAndUpdate(
            { id: activity.target },
            { $set: activity.object }
          );
          activity.object = response.circle.id;
          activity.objectType = "Circle";

          break;
        case activity.object.type == "Group":
          response.group = await Group.findOneAndUpdate(
            { id: activity.target },
            { $set: activity.object }
          );
          activity.object = response.group.id;
          activity.objectType = "Group";
          break;
        default:
          break;
      }
      break;
    case "Delete":
      response.post = await Post.findOneAndUpdate(
        { id: activity.target, actor: activity.actor },
        { $set: { formerType: $type, type: "Tombstone", deleted: true } }
      );
      break;
    case "Like":
      response.post = await Post.findOneAndUpdate(
        { id: activity.target },
        { $push: { likes: activity.object } }
      );
      activity.objectType = "Post";

      break;
    case "Unlike":
      response.post = await Post.findOneAndUpdate(
        { id: activity.target },
        { $pull: { likes: activity.object } }
      );
      activity.objectType = "Post";

      break;
    case "Reply":
      response.post = await Post.create(activity.object);
      await Post.findOneAndUpdate(
        { id: activity.target },
        { $push: { replies: response.post.id } }
      );
      activity.objectType = "Post";

      break;
    case "Follow":
      await Actor.findOneAndUpdate(
        { id: activity.actor },
        { $push: { following: activity.target } }
      );
      response.actor = await Actor.findOneAndUpdate(
        { id: activity.target },
        { $push: { followers: activity.actor } }
      );
      break;
    case "Unfollow":
      await Actor.findOneAndUpdate(
        { id: activity.actor },
        { $pull: { following: activity.target } }
      );
      response.actor = await Actor.findOneAndUpdate(
        { id: activity.target },
        { $pull: { followers: activity.actor } }
      );
      break;
    case "Join":
      response.group = await Group.findOneAndUpdate(
        { id: activity.target },
        { $push: { members: activity.actor } }
      );
      break;
    case "Leave":
      response.group = await Group.findOneAndUpdate(
        { id: activity.target },
        {
          $pull: {
            members: activity.actor,
            admins: activity.actor,
            moderators: activity.actor,
          },
        }
      );
      break;
    case "Block":
      await Actor.findOneAndUpdate(
        { id: activity.actor },
        { $push: { blocked: activity.target } }
      );
      activity.public = false;
      break;
    case "Flag":
      response.post = await Post.findOneAndUpdate(
        { id: activity.target },
        { $set: { flagged: true } }
      );
      activity.public = false;
      break;
    default:
      break;
  }
  response.activity = await Activity.create(activity);
  return response;
}
