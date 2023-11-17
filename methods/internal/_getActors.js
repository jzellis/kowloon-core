/**
 * @namespace kowloon
 */
import { Actor } from "../../schema/index.js";

export default async function handler(
  query = {},
  page,
  options = { pageLength: 20, sort: "-published", getFeeds: false }
) {
  try {
    if (options.getFeeds == false) query.type = { ...query.type, $ne: "Feed" };
    return page
      ? await Actor.find(query)
          .sort(options.sort)
          .skip((page - 1) * options.pageLength)
          .limit(options.pageLength)
      : await Actor.find(query).sort(options.sort);
  } catch (error) {
    return { error };
  }
}
