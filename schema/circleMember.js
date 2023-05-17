import * as dotenv from "dotenv";
import mongoose from "mongoose";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId;
/**
 * @class CircleMember
 */

export const CircleMember = new Schema(
  {
    actor: { type: ObjectId, ref: "Actor" },
    accepted: Date,
    deleted: Date,
    inviteCode: { type: String, default: "" },
  },
  { timestamps: true }
);
