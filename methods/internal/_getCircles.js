/**
 * @namespace kowloon
 */
import { Actor, Circle } from "../../schema/index.js";

export default async function handler(
  query = {},
  page = 1,
  options = {
    populate: ["creator", "members"],
    pageLength: 20,
    sort: "createdAt",
  }
) {
  try {
    let circles = await Circle.find(query)
      .sort(options.sort)
      .skip((page - 1) * options.pageLength)
      .limit(options.pageLength);
    if (options.populate.length > 0) {
      await Promise.all(
        circles.map(async (circle) => {
          if (options.populate.includes("creator"))
            circle.creator = await this.sanitize(this.getActor(circle.creator));
          if (options.populate.includes("members"))
            circle.members = await this.sanitize(
              Actor.find({ id: { $in: circle.members } })
            );
          return circle;
        })
      );
    }
    return circles;
  } catch (error) {
    return { error };
  }
}
