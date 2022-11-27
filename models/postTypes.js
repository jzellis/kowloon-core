import { Schema, model, models } from "mongoose";

const postTypeSchema = new Schema(
  {
    name: String,
    value: String,
    description: String,
  },
  { timestamps: true }
);

const PostType = models.PostType || model("PostType", postTypeSchema);

export default PostType;
