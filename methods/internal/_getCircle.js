/**
 * @namespace kowloon
 */
import { Actor, Circle } from "../../schema/index.js";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
export default async function handler(
  id,
  options = { populate: ["creator", "members"] }
) {
  try {
    let query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
    let circle = await Circle.findOne(query);
    if (options.populate.includes("creator"))
      circle.creator = await this._getActor(circle.creator);
    if (options.populate.includes("members"))
      circle.members = await Actor.find({ id: { $in: circle.members } });
    return circle;
  } catch (error) {
    return { error };
  }
}
