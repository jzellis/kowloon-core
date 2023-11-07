import { User } from "../../schema/index.js";

export default async function handler(
  query = {},
  page = 1,
  options = { pageLength: 20 }
) {
  try {
    return await User.find(query)
      .populate("actor")
      .skip((page - 1) * options.pageLength)
      .limit(options.pageLength);
  } catch (error) {
    return { error };
  }
}
