/**
 * @namespace kowloon
 */
import { Actor } from "../../schema/index.js";

export default async function (followerID, followedID) {
  try {
    const actor = await Actor.findOne({ id: followedID });
    actor.followers.push(followerID);
    await actor.save();
    return actor;
  } catch (error) {
    return { error };
  }
}
