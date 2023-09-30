import Actor from "../schema/actor.js";

export default async function handler(id) {
  console.log(id);
  return this.sanitize(await Actor.findOne({ preferredUsername: id }));
}
