import Activity from "../schema/activity.js";

export default async function handler() {
  await this.redis.del("activities");
  let activities = await Activity.find({
    published: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) },
  }).select("-_id -__v");
  await Promise.all(
    activities.map(async (activity) => {
      await this.redis.SET(
        `activities:${this.hash(activity.id)}`,
        JSON.stringify(activity)
      );
    })
  );
}
