import mongoose from "mongoose";
import Kowloon from "../index.js";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Media
 */
export const MediaSchema = new Schema(
  {
    owner: { type: ObjectId, required: true, ref: "User" },
    path: String,
    url: String,
    title: String,
    caption: String,
    type: { type: String, default: "image" },
    mimeType: { type: String, default: "image/jpg" },
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
    collection: "media",
  }
);

MediaSchema.methods.getUrl = function () {
  return `https://${Kowloon.settings.domain}${this.url}`;
};

export const Media = mongoose.model("Media", MediaSchema);
