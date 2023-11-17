/**
 * @namespace kowloon
 */
import {
  Activity,
  Actor,
  Circle,
  Group,
  Post,
  User,
} from "../../schema/index.js";

export default async function (activity) {
  try {
    let response = {};
    let actor = await this._getActor(activity.actor);
    if (!actor) actor = await Actor.findOne({ _id: this.settings.serverUser });
    switch (activity.type) {
      case "Create":
        switch (true) {
          case activity.objectType == "Actor":
            response.actor = await Actor.create(activity.object);
            activity.object = response.actor.id;
            activity.objectType = "Actor";
            activity.href = response.actor.href;
            break;
          case activity.objectType == "Circle":
            response.circle = await Circle.create(activity.object);
            activity.object = response.circle.id;
            activity.objectType = "Circle";
            activity.href = response.circle.href;
            break;
          case activity.objectType == "Group":
            response.group = await Group.create(activity.object);
            activity.object = response.group.id;
            activity.objectType = "Group";
            activity.href = response.group.href;

            break;
          case activity.objectType == "Post" ||
            this.postTypes.includes(activity.objectType) ||
            activity.objectType == "Post":
            activity.object.signature = actor.publicKey;
            response.post = await Post.create(activity.object);
            activity.object = response.post.id;
            activity.objectType = "Post";
            activity.href = response.post.href;

            break;
          default:
            break;
        }
        break;
      case "Update":
        switch (true) {
          case activity.objectType == "Post" ||
            this.postTypes.includes(activity.objectType):
            let originalPost = await Post.findOne({
              id: activity.target,
              actor: activity.actor,
            });
            Object.keys(activity.object).forEach((key) => {
              originalPost[key] = activity.object[key];
            });
            originalPost = await originalPost.save();
            response.post = originalPost;
            activity.object = response.post.id;
            activity.objectType = "Post";
            activity.href = response.post.href;
            if (response.post.circle) activity.circle = response.post.circle;
            break;
          case activity.objectType == "Actor":
            let originalActor = await Actor.findOne({ id: activity.target });
            Object.keys(activity.object).forEach((key) => {
              originalActor[key] = activity.object[key];
            });
            originalActor = await originalActor.save();
            response.actor = originalActor;
            activity.object = response.actor.id;
            activity.objectType = "Actor";
            activity.href = response.actor.href;

            break;
          case activity.objectType == "Circle":
            let originalCircle = await Circle.findOne({ id: activity.target });
            Object.keys(activity.object).forEach((key) => {
              originalCircle[key] = activity.object[key];
            });
            originalCircle = await originalCircle.save();
            response.circle = originalCircle;
            activity.object = response.circle.id;
            activity.objectType = "Circle";
            activity.href = response.circle.href;

            break;
          case activity.objectType == "Group":
            let originalGroup = await Group.findOne({ id: activity.target });
            Object.keys(activity.object).forEach((key) => {
              originalGroup[key] = activity.object[key];
            });
            originalGroup = await originalGroup.save();
            response.group = originalGroup;
            activity.object = response.group.id;
            activity.objectType = "Group";
            activity.href = response.group.href;

            break;
          default:
            break;
        }
        break;
      case "Delete":
        response.post = await Post.findOneAndUpdate(
          { id: activity.target, actor: activity.actor },
          { $set: { formerType: $type, type: "Tombstone", deleted: true } },
          { new: true }
        );
        break;
      case "Like":
        await Actor.findOneAndUpdate(
          { id: activity.actor },
          { $push: { likes: activity.target } }
        );
        response.post = await Post.findOneAndUpdate(
          { id: activity.target },
          { $push: { likes: activity.object } },
          { new: true }
        );
        activity.objectType = "Post";
        activity.href = response.post.href;

        break;
      case "Unlike":
        await Actor.findOneAndUpdate(
          { id: activity.actor },
          { $pull: { likes: activity.target } }
        );
        response.post = await Post.findOneAndUpdate(
          { id: activity.target },
          { $pull: { likes: activity.object } },
          { new: true }
        );
        activity.objectType = "Post";
        activity.href = response.post.href;

        break;
      case "Bookmark":
        await Actor.findOneAndUpdate(
          { id: activity.actor },
          { $push: { bookmarks: activity.target } }
        );
        response.post = await Post.findOne({ id: activity.target });

        activity.objectType = "Post";
        activity.href = response.post.href;

        break;
      case "Unbookmark":
        await Actor.findOneAndUpdate(
          { id: activity.actor },
          { $pull: { bookmarks: activity.target } }
        );
        response.post = await Post.findOne({ id: activity.target });
        activity.objectType = "Post";
        activity.href = response.post.href;
        break;
      case "Reply":
        response.post = await Post.create(activity.object);
        await Post.findOneAndUpdate(
          { id: activity.target },
          { $push: { replies: response.post.id } },
          { new: true }
        );
        activity.objectType = "Post";
        activity.href = response.post.href;

        break;
      case "Follow":
        let followedActor = await Actor.findOne({ id: activity.target });
        await Actor.findOneAndUpdate(
          { id: activity.actor },
          { $push: { following: activity.target } },
          { new: true }
        );
        response.actor = await Actor.findOneAndUpdate(
          { id: activity.target },
          { $push: { followers: activity.actor } },
          { new: true }
        );
        activity.href = followedActor.href;

        break;
      case "Unfollow":
        let unfollowedActor = await Actor.findOne({ id: activity.target });

        await Actor.findOneAndUpdate(
          { id: activity.actor },
          { $pull: { following: activity.target } },
          { new: true }
        );
        response.actor = await Actor.findOneAndUpdate(
          { id: activity.target },
          { $pull: { followers: activity.actor } },
          { new: true }
        );
        activity.href = unfollowedActor.href;

        break;
      case "Join":
        response.group = await Group.findOneAndUpdate(
          { id: activity.target },
          { $push: { members: activity.actor } },
          { new: true }
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
          },
          { new: true }
        );
        activity.href = response.group.href;

        break;
      case "Block":
        await Actor.findOneAndUpdate(
          { id: activity.actor },
          { $push: { blocked: activity.target } },
          { new: true }
        );
        activity.public = false;
        break;
      case "Flag":
        response.post = await Post.findOneAndUpdate(
          { id: activity.target },
          { $set: { flagged: true } },
          { new: true }
        );
        activity.public = false;
        activity.href = response.post.href;

        break;
      default:
        break;
    }
    response.activity = await Activity.create(activity);
    return response;
  } catch (error) {
    return { error };
  }
}
