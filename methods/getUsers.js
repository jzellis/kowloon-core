import { User } from "../schema/index.js";
export default async function handler(q) {
  return await User.find(q, "username email actor _id");
}
