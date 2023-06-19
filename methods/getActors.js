import ActorSchema from "../schema/actor.js";
import { User } from "../schema/index.js";
export default async function handler(userList) {
  let actors = {};
  (await User.find({ id: { $in: userList } }, "actor")).map((a) => {
    actors[a.actor.id] = this.sanitize(a.actor);
  });
  return actors;
}
