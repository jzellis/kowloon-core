import * as dotenv from "dotenv";

import mongoose from "mongoose";
import { Media, MediaSchema } from "./media.js";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Feed
 */

const feedSchema = new Schema(
  {
    version: { type: String, default: "https://jsonfeed.org/version/1.1" },
    id: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    external_url: String, // This is an external link, like for Kowloon "link" posts
    title: { type: String, required: false, default: "" },
    kowloon: {
      post_type: String,
      source: {
        type: { type: "String", default: "Following" },
        name: String,
        url: String, // the URL of the source, not the feed URL
        icon: String,
      },
      // activityPub: {
      //   context: { type: Mixed },
      //   type: String,
      //   id: String,
      //   source: {
      //     content: String,
      //     mediaType: { type: String, default: "text/html" },
      //   },
      // },
      attachments: [MediaSchema],
      read: { type: Boolean, default: false },
      bookmarked: { type: Boolean, default: false },
      bookmarkedAt: Date,
    },
    date_published: { type: Date },
    content_html: String,
    content_text: String,
    summary: String,
    image: String,
    author: {
      name: [String],
      url: [String],
    },
    tags: [String],
    language: { type: String, default: "EN" },
  },
  { strict: false, timestamps: true }
);

feedSchema.pre("save", async function (next) {
  this.content_html = sanitizeHtml(this.content_html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, ...["img", "a"]],
  });
  if (!this.content_text) this.content_text = htmlToText(this.content_html);
  if (!this.summary)
    this.summary = this.content_html.split("</p>").slice(0, 1) + "</p>";
  next();
});

const Feed = mongoose.model("Feed", feedSchema);
const Bookmark = mongoose.model("Bookmark", feedSchema);

export default Feed;
