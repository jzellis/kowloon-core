import Actor from "../schema/actor.js";

export default async function handler(criteria = {}, page = 1) {
  return this.sanitize(
    await Actor.find(criteria)
      .limit(page * 20)
      .skip((page - 1) * 20)
  );
}
