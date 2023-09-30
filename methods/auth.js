import Actor from "../schema/actor.js";
import User from "../schema/user.js";

export default async function handler(accessToken) {
  try {
    let user = await User.findOne({ accessToken })
      .select("-password -privateKey")
      .populate("actor");

    user.lastAccessed = Date.now();
    user.save();
    this.user = user;
    this.actor = await Actor.findOne({ _id: user.actor });
    return user;
  } catch (e) {
    return { error: e };
  }
}
