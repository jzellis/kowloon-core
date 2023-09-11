import Actor from "../schema/actor.js";
import User from "../schema/user.js";

export default async function handler(accessToken) {
  try {
    let user = await User.findOne({ accessToken }).select(
      "-password -privateKey"
    );

    user.lastAccessed = Date.now();
    user.save();
    return user;
  } catch (e) {
    return { error: e };
  }
}
