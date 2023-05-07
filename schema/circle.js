import * as dotenv from "dotenv";
import mongoose from "mongoose";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;
/**
 * @class Circle
 */
const CircleSchema = new Schema(
  {
    user: { type: ObjectId, ref: "User" },
    name: { type: String, required: true },
    icon: { type: String, default: "circle.png" },
    description: String,
    following: [
      {
        id: { type: ObjectId, required: true, ref: "Following" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    friends: [
      {
        id: { type: ObjectId, required: true, ref: "Friend" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Circle = mongoose.model("Circle", CircleSchema);

export default Circle;
