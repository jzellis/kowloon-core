import { Actor } from "../../schema/index.js";

export default async function (query) {
  return await Actor.countDocuments(query);
}
