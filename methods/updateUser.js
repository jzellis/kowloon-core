import User from "../schema/user.js";

export default async function handler(user) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: user.id },
      { $set: user }
    );
    return updatedUser;
  } catch (e) {
    return { error: e };
  }
}
