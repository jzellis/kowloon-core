import { Activity } from "../../schema/index.js";

export default async function handler(
  query,
  page = 1,
  options = { sort: "published", populate: ["actors"], pageLength: 20 }
) {
  try {
    query = { ...query, deleted: { $exists: false } };
    let items = await Activity.find(query)
      .sort(options.sort)
      .skip((page - 1) * options.pageLength)
      .limit(options.pageLength);
    if (options.populate.includes("actors")) {
      items = await Promise.all(
        items.map(async (activity) => {
          activity.actor = await this.getActor(activity.actor);
          return activity;
        })
      );
    }
    return items;
  } catch (error) {
    return { error };
  }
}
