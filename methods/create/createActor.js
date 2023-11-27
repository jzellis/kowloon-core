/**
 * @namespace kowloon
 */
import { Actor } from "../../schema/index.js";

export default async function (actor) {
  try {
    actor = await Actor.create(actor);
    return this.sanitize(JSON.parse(JSON.stringify(actor)));
  } catch (error) {
    return { error };
  }
}
