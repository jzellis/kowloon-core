import {
  Activity,
  Actor,
  Circle,
  Group,
  Post,
  User,
} from "../../schema/index.js";

export default async function () {
  try {
    await Activity.deleteMany({});
    await Actor.deleteMany({});
    await Circle.deleteMany({});
    await Group.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    return true;
  } catch (error) {
    return { error };
  }
}
