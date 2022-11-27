import { Schema, model, models } from "mongoose";

const mediaSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    filename: String,
    title: String,
    type: String,
    description: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Media = models.Media || model("Media", mediaSchema);

export default Media;
