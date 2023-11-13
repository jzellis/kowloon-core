import { User } from "../../schema/index.js";

export default async function (query) {
  return await User.countDocuments(query);
}
