import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import Group from "./group.js";
import Settings from "./settings.js";

import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
const Schema = mongoose.Schema;
const PostSchema = AsObjectSchema.clone();
// import Kowloon from "../kowloon.js";

PostSchema.add({
  actor: { type: Object, required: true },
  type: {
    type: String,
    // enum: ["Note", "Article", "Link", "Gallery", "Image", "Audio", "Video"],
    default: "Note",
  },
  name: { type: String, required: false, alias: "title" },
  attributedTo: { type: Object },
  likes: { type: [Object], default: [] },
  replies: { type: [Object], default: [] },
  quotes: { type: [Object], default: [] },
  to: { type: [String], default: [] },
  bto: { type: [String], default: [] },
  cc: { type: [String], default: [] },
  bcc: { type: [String], default: [] },
  source: {
    content: { type: String, default: "" },
    mediaType: { type: String, default: "text/html" },
  },
  published: Date,
  public: { type: Boolean, default: false },
});

PostSchema.index({
  source: "text",
  "source.content": "text",
  "location.name": "text",
});

PostSchema.pre("save", async function (next) {
  this.id =
    this.id ||
    `${(await Settings.findOne({ name: "domain" })).value}/posts/${this._id}`;

  // This needs to do sanitizing at some point but for now we'll just leave it
  // this.content = this.content ? this.content : this.source.content;
  this.source.mediaType = this.source.mediaType || "text/html";
  if (this.source.mediaType.includes("html")) {
    const allowedTags = sanitizeHtml.defaults.allowedTags.concat(["img"]);
    // this.content = `${sanitizeHtml(this.source.content, {
    //   allowedTags,
    // })}`;
    this.content = this.source.content;
  } else if (this.source.mediaType.includes("markdown")) {
    this.content = `${marked(this.source.content)}`;
  }

  this.attributedTo = this.attributedTo || this.actor;
  if (this.public === true && !this.audience)
    this.audience = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: "https://www.w3.org/ns/activitystreams#Public",
      type: "Collection",
    };
  // if (!this.cc.includes(this.actor)) this.cc.push(this.actor);
  // Makes the post privacy match the group's privacy if it's a group post

  if (this.partOf) {
    this.public = (await Group.findOne({ id: this.partOf })).public;
    this.audience = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: this.partOf,
      type: "Group",
    };
  }

  next();
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
