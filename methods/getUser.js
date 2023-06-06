import { User } from "../schema/index.js";
export default async function handler(q) {
  return await User.findOne(q, "username email actor _id");
}
