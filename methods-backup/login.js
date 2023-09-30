import { Actor } from "../schema/actor.js";
import User from "../schema/user.js";

export default async function handler(username, password) {
  console.log(username, password);
  try {
    let user = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select();
    if (!user) return { error: "No user with that username or email found!" };
    if (!user.verifyPassword(password)) return { error: "Incorrect password" };
    user.lastLogin = Date.now();
    user.save();
    return user.accessToken;
  } catch (e) {
    return { error: e };
  }
}
