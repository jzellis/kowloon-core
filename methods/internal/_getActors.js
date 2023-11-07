import { Actor } from "../../schema/index.js";

export default async function handler(
  query = {},
  page = 1,
  options = { pageLength: 20, sort: published }
) {
  try {
    return await Actor.find(query)
      .sort(options.sort)
      .skip((page - 1) * options.pageLength)
      .limit(options.pageLength);
  } catch (error) {
    return { error };
  }
}
