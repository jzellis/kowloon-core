import { Actor } from "../../schema/index.js";
import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export default async function handler(id) {
  return await Actor.findOne({
    $or: [{ id: id }, { username: id }],
  });
}
