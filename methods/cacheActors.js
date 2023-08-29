import Actor from "../schema/actor.js";
export default async function handler() {
  await this.redis.del("actors");
  let actors = await Actor.find().select(
    "id preferredUsername name summary location url icon publicKey -_id"
  );
  await Promise.all(
    actors.map(async (actor) => {
      await this.redis.SET(
        `actors:${this.hash(actor.id)}`,
        JSON.stringify(actor)
      );
    })
  );
}
