import { Actor, Circle } from "../../schema/index.js";

export default async function handler(
  _id,
  options = { populate: ["creator", "members"] }
) {
  try {
    let circle = await Circle.findOne({ $or: [{ _id }, { id: _id }] });
    if (options.populate.includes("creator"))
      circle.creator = await this.getActor(circle.creator);
    if (options.populate.includes("members"))
      circle.members = await Actor.find({ id: { $in: circle.members } });
    return circle;
  } catch (error) {
    return { error };
  }
}
