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

export default async function handler(username, password) {
  try {
    let user = await User.findOne({
      $or: [{ username }, { email: username }],
    })
      .populate("actor")
      .populate({ path: "actor.circles", model: "Circle" });
    if (!user) return { error: "No user with that username or email found!" };
    if (!(await user.verifyPassword(password)))
      return { error: "Incorrect password" };
    user.lastLogin = Date.now();
    user.save();
    user.actor = await Actor.populate(
      user.actor,
      "circles following followers"
    );
    console.log(user);
    const returnedUser = user;

    return returnedUser;
  } catch (e) {
    console.log(e);
    return { error: e };
  }
}
