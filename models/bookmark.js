import { Schema, model, models } from "mongoose";

const bookmarkSchema = new Schema(
  {
    feed: { type: Schema.ObjectId, ref: "Following" },
    title: String,
    url: String,
    postType: String,
    author: String,
    commentsUrl: String,
    content: {
      description: String,
      text: String,
      html: String,
    },
    meta: { type: Schema.Types.Mixed, default: { tags: [] } },
    link: String,
    read: { type: Boolean, default: false },
    image: String,
    readAt: Date,
    pubDate: Date,
  },
  { timestamps: true }
);

const Bookmark = models.Bookmark || model("Bookmark", bookmarkSchema);

export default Bookmark;
