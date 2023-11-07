import { User } from "../../schema/index.js";

export default async function (user) {
  try {
    return await User.findOneAndUpdate({ id: user.id }, { $set: user });
  } catch (error) {
    return { error };
  }
}
