import Actor from "../schema/actor.js";
import Post from "../schema/post.js";
export default async function handler() {
  await this.redis.del("timeline");
  let actors = await Actor.find().select("id");
  await Promise.all(
    actors.map(async (actor) => {
      (
        await Post.find({
          $or: [
            { to: actor.id },
            { bto: actor.id },
            { cc: actor.id },
            { bcc: actor.id },
          ],
        })
      ).map(async (post) => {
        await this.redis.HSET(
          `timeline:${this.hash(actor.id)}`,
          this.hash(post.id),
          JSON.stringify(post)
        );
      });
    })
  );
}
