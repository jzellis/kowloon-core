import { User } from "../schema/index.js";
export default async function handler(actor) {
  this.actor = actor;
}
