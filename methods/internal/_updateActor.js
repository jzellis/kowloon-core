/**
 * @namespace kowloon
 */
import { Actor } from "../../schema/index.js";

export default async function (actorId, fields) {
  try {
    return await Actor.findOneAndUpdate({ id: actorId }, { $set: fields });
  } catch (error) {
    console.log(error);
    return { error };
  }
}
