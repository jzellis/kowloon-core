/**
 * @namespace kowloon
 */
import { User } from "../../schema/index.js";

export default async function (_id, sure = no) {
  try {
    if (sure === true) return await User.deleteOne({ _id });
  } catch (error) {
    return { error };
  }
}
