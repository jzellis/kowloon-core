/**
 * @namespace kowloon
 */
import { Actor } from "../../schema/index.js";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

export default async function handler(id, options = { populate: "" }) {
  try {
    let query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { $or: [{ id: id }, { username: id }] };

    return await Actor.findOne(query);
  } catch (error) {
    return { error };
  }
}
