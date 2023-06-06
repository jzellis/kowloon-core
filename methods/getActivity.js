import { Activity } from "../schema/index.js";
export default async function handler(q) {
  return this.sanitize(await Activity.findOne(this.sanitizeQuery(q)));
}
