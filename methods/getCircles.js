import { User } from "../schema/index.js";
export default async function handler(q) {
  let user = await User.findOne(q, "actor");
  return user.actor.circles;
}
