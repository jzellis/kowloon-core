import { Group } from "../../schema/index.js";

export default async function (query) {
  return await Group.countDocuments(query);
}
