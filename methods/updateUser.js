import { User } from "../schema/index.js";

export default async function handler(user) {
  user.isAdmin =
    user.accessToken =
    user.lastLogin =
    user.created =
    user.updated =
    user._id =
      undefined;
  console.log(user);
  try {
    let returned = await User.findOneAndUpdate(
      { "actor.id": user["actor.id"] },
      { $set: user },
      { new: true }
    );
    returned.password = undefined;
    return this.sanitize(returned);
  } catch (e) {
    console.log(e);
    return { error: e };
  }
}
