import { User } from "../schema/index.js";
export default async function handler(q) {
  let actors = await User.find(q);
  return actors.map((user) => {
    let actor = user.actor;
    actor.following =
      user.prefs.publicFollowing == true ? actor.following : undefined;
    actor.followers =
      user.prefs.publicFollowers == true ? actor.followers : undefined;
    return this.sanitize(actor);
  });
}
