/**
 * @namespace kowloon
 */
import { Actor } from "../../schema/index.js";

export default async function (query) {
  query.type = { ...query.type, $ne: "Feed" };
  return await Actor.countDocuments(query);
}
