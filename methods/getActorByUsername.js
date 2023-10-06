import Actor from "../schema/actor.js";

export default async function handler(id) {
  let actor = await Actor.findOne({ preferredUsername: id });
  return actor ? this.sanitize(actor) : null;
}
