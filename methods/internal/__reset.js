/**
 * @namespace kowloon
 */
import {
  Activity,
  Actor,
  Circle,
  Group,
  Invite,
  Post,
  Settings,
  User,
} from "../../schema/index.js";

export default async function () {
  try {
    await Activity.deleteMany({});
    await Actor.deleteMany({});
    await Circle.deleteMany({});
    await Group.deleteMany({});
    await Invite.deleteMany({});
    await Post.deleteMany({});
    await Settings.deleteMany({});
    await User.deleteMany({});
    return true;
  } catch (error) {
    return { error };
  }
}
