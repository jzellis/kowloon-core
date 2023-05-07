import * as dotenv from "dotenv";

import mongoose from "mongoose";
dotenv.config();
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Comment
 */
const CommentSchema = new Schema(
  {
    author: String,
    commentOn: { type: ObjectId, required: true, ref: "Post" },
    body: String,
    attachment: [{ type: ObjectId, ref: "Media" }],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
