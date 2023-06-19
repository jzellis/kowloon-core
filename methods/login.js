import { User } from "../schema/index.js";
export default async function handler({ username, password }) {
  if (username && password) {
    let user = await User.findOne({ username: username.trim() });
    if (!user) return { error: "User not found on this server" };
    let verify = await user.verifyPassword(password);
    if (!verify) {
      return { error: "Password is incorrect" };
    } else {
      let user = await User.findOneAndUpdate(
        { username: username.trim() },
        { lastLogin: Date.now() },
        { new: true }
      );
      return {
        token: user.accessToken,
        user: {
          username: user.username,
          email: user.email,
          actor: user.actor,
          prefs: user.prefs,
        },
      };
    }
  } else {
    return false;
  }
}
