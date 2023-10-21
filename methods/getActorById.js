import Actor from "../schema/actor.js";
import Feed from "../schema/feed.js";

export default async function handler(id) {
  if (!id) console.log("Unknown id");
  let actor = this.sanitize(await Actor.findOne({ id }));
  if (!actor) actor = this.sanitize(await Feed.findOne({ id }));
  return actor;
}
