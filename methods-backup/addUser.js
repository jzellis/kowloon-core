import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import User from "../schema/user.js";

export default async function handler(user) {
  try {
    let actor;
    if (typeof user.actor === "object") {
      actor = await Actor.create(user.actor);
      user.actor = actor._id;
    }
    if (await User.findOne({ username: user.username }))
      return { error: "Username already exists on this server" };
    user = await User.create({ ...user, isAdmin: false });

    if (actor._id)
      await Actor.findOneAndUpdate({ _id: actor._id }, { user: user._id });
    return user;
  } catch (e) {
    return { error: e };
  }
}
