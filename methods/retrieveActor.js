import { User } from "../schema/index.js";

export default async function handler(id) {
  let user = await User.findOne({ "actor.id": id });
  if (user) {
    return user.actor;
  } else {
    let actorRes = await this.fetchGet(id);
    let actor = await actorRes.json();
    if (actor.inbox) return actor;
  }
}
