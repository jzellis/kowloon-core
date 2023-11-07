import {
  Activity,
  Actor,
  Circle,
  Group,
  Post,
  User,
} from "../../schema/index.js";

export default async function handler(username, password) {
  try {
    let user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user) return { error: "No user with that username or email found!" };
    if (!(await user.verifyPassword(password)))
      return { error: "Incorrect password" };
    user.lastLogin = Date.now();
    user.save();

    const returnedUser = this.sanitize(user);
    const actor = await Actor.findById(user.actor).populate("circles");
    returnedUser.actor = actor;

    return returnedUser;
  } catch (e) {
    return { error: e };
  }
}