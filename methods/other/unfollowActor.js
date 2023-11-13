import { Actor } from "../../schema/index.js";

export default async function (followerID, followedID) {
  try {
    const actor = await Actor.findOne({ id: followedID });
    actor.followers.splice(actor.followers.indexOf(followerID), 1);
    await actor.save();
    return actor;
  } catch (error) {
    return { error };
  }
}
