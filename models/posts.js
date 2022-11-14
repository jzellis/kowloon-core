import { Schema, model, models } from "mongoose";
import User from "./users";
import Media from "./media";

const postSchema = new Schema(
  {
    author: { type: Schema.ObjectId, required: true, ref: "User" },
    postType: {
      type: String,
      enum: ["status", "post", "media", "link"],
      default: "status",
      required: true,
    },
    title: String,
    slug: String,
    content: {
      description: String,
      html: String,
      text: String,
    },
    meta: { type: Schema.Types.Mixed, default: { tags: [] } },
    media: [{ type: Schema.ObjectId, ref: "Media" }],
    link: String,
    circles: [{ type: Schema.ObjectId, ref: "Circle" }],
    published: { type: Boolean, default: true },
    public: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Post = models.Post || model("Post", postSchema);

export default Post;
