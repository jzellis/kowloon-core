import { Circle } from "../../schema/index.js";

export default async function (query) {
  return await Circle.countDocuments(query);
}
