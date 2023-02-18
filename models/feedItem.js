import { Schema, model, models } from "mongoose";

const feedItemSchema = new Schema(
  {
    feed: { type: Schema.ObjectId, ref: "Following" },
    title: String,
    site: String,
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
  {
    timestamps: true,
    capped: { size: 209715200, max: 1000, autoIndexId: true },
  }
);

const FeedItem = models.FeedItem || model("FeedItem", feedItemSchema);

export default FeedItem;
