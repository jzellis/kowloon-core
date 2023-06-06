import { User } from "../schema/index.js";
export default async function handler(q) {
  const user = await User.findOne(q);

  const actor = user.actor || null;
  if (actor) {
    actor.following =
      user.prefs.publicFollowing == true ? actor.following : undefined;
    actor.followers =
      user.prefs.publicFollowers == true ? actor.followers : undefined;
    return this.sanitize(actor);
  }
}
