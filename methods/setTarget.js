import { User } from "../schema/index.js";
export default async function handler(target) {
  this.target = target;
}
