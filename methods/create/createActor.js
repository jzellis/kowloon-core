import { Actor } from "../../schema/index.js";

export default async function (actor) {
  try {
    const summary = `${actor.name} joined the server!`;
    return this.sanitize(await Actor.create(actor));
  } catch (error) {
    return { error };
  }
}
