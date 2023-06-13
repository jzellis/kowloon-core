import { User } from "../schema/index.js";
export default async function handler(id) {
  console.log(id);
  let actor;
  actor = JSON.parse(await this.redis.get(this.hash(id)));
  if (!actor) actor = await User.findOne({ "actor.id": id }, "actor");
  if (!actor)
    try {
      actor = await (await fetch("http://" + this.webfinger(id))).json();
      await this.redis.set(this.hash(actor.id), JSON.stringify(actor));
    } catch (e) {}
  return actor;
}
