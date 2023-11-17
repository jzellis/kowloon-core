/**
 * @namespace kowloon
 */
import { User } from "../../schema/index.js";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
export default async function handler(id) {
  try {
    let query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
    return await User.findOne(query).populate("actor");
  } catch (error) {
    return { error };
  }
}
