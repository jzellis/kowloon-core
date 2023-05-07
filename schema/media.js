import mongoose from "mongoose";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Media
 */
export const MediaSchema = new Schema(
  {
    author: { type: ObjectId, required: true, ref: "User" },
    url: String,
    title: String,
    caption: String,
    type: { type: String, default: "image" },
    mediaType: { type: String, default: "image/jpg" },
  },
  { timestamps: true, collection: "media" }
);

export const Media = mongoose.model("Media", MediaSchema);
