/**
 * @namespace kowloon
 */
import { User, Actor } from "../../schema/index.js";

export default async function handler(accessToken) {
  try {
    let user = await User.findOne({ accessToken })
      .select("-password -privateKey")
      .populate("actor");

    // user.lastAccessed = Date.now();
    // user.save();
    this.user = user;
    // this.actor = await Actor.findOne({ _id: user.actor._id });
    return user;
  } catch (error) {
    return { error };
  }
}
