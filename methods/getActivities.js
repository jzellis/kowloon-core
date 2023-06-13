import { Activity } from "../schema/index.js";
export default async function handler(q) {
  return await Activity.find(q);
}
