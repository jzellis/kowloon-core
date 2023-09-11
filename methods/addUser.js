import Activity from "../schema/activity.js";
import User from "../schema/user.js";

export default async function handler(user) {
  try {
    if (await User.findOne({ username: actor.username }))
      return { error: "Username already exists on this server" };
    return await User.create({ ...user, isAdmin: false });
  } catch (e) {
    return { error: e };
  }
}
