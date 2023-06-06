import { User } from "../schema/index.js";
export default async function handler({ username, password }) {
  let user = await User.findOneAndUpdate(
    { username: username.trim() },
    { lastLogin: Date.now() },
    { new: true }
  );
  if (!user) return { error: "User not found on this server" };
  let verify = await user.verifyPassword(password);
  if (!verify) {
    return { error: "Password is incorrect" };
  } else {
    return {
      token: user.accessToken,
      actor: this.sanitize(user.actor),
    };
  }
}
