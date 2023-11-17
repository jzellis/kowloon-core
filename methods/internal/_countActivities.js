/**
 * @namespace kowloon
 */
import { Activity } from "../../schema/index.js";

export default async function (query) {
  return await Activity.countDocuments(query);
}
