import { User } from "../schema/index.js";
export default async function handler(owner) {
  this.owner = owner;
}
