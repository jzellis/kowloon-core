/**
 * @namespace kowloon
 */
import { Actor } from "../../schema/index.js";

export default async function (actor) {
  try {
    return this.sanitize(await Actor.create(actor));
  } catch (error) {
    return { error };
  }
}
