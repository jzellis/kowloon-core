import Actor from "../schema/actor.js";

export default async function handler(id) {
  return await Actor.findOne({ id });
}
