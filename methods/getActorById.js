import Actor from "../schema/actor.js";

export default async function handler(id) {
  let actor = this.sanitize(await Actor.findOne({ id }));
  return actor;
}
