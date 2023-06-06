import { User } from "../schema/index.js";
export default async function handler(user) {
  this.user = user;
}
