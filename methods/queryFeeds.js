import Feed from "../schema/feed.js";

export default async function handler(criteria = {}, page = 1) {
  return this.sanitize(
    await Feed.find(criteria)
      .limit(page * 20)
      .skip((page - 1) * 20)
  );
}
