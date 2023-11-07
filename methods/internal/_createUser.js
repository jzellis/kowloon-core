import { User } from "../../schema/index.js";

export default async function (user) {
  try {
    return await User.create(user);
  } catch (error) {
    return { error };
  }
}
