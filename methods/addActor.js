import Activity from "../schema/activity.js";
import Actor from "../schema/actor.js";
import Post from "../schema/post.js";

export default async function handler(actor) {
  try {
    if (await Actor.findOne({ username: actor.username }))
      return { error: "Username already exists on this server" };
    actor = await Actor.create(actor);
    await Activity.create({
      type: "Create",
      actor: actor.id,
      object: actor.id,
      summary: `${actor.name} (${actor.id}) signed up!`,
    });
    return actor;
  } catch (e) {
    return { error: e };
  }
}
