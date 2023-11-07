import { User } from "../../schema/index.js";
export default async function handler(id) {
  try {
    return await User.findOne({ $or: [{ _id: id }, { id }] }).populate("actor");
  } catch (error) {
    return { error };
  }
}
