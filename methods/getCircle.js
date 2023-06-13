import { User } from "../schema/index.js";
export default async function handler(q) {
  let user = await User.findOne({ "actor.circles._id": q }, "actor.circles");
  return user.actor.circles.filter((c) => (c._id = q))[0];
}
