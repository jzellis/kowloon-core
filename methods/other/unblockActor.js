/**
 * @namespace kowloon
 */
import { Actor } from "../../schema/index.js";

export default async function (blockedID, followedID) {
  try {
    const actor = await Actor.findOne({ id: followedID });
    actor.blocked.splice(actor.blocked.indexOf(blockedID), 1);
    await actor.save();
    return actor;
  } catch (error) {
    return { error };
  }
}
