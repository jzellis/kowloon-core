import { Activity } from "../schema/index.js";
export default async function handler(q) {
  console.log("Query: ", this.sanitizeQuery(q));
  return await Activity.find(this.sanitizeQuery(q), this.sanitizedFields);
}
