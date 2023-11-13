import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import { Group, Settings, Circle } from "./index.js";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
const PostSchema = AsObjectSchema.clone();
const ReplySchema = AsObjectSchema.clone();
// import Kowloon from "../kowloon.js";

PostSchema.add({
  actor: { type: Object, required: true },
  type: {
    type: String,
    // enum: ["Note", "Article", "Link", "Gallery", "Image", "Audio", "Video"],
    default: "Note",
  },
  name: { type: String, required: false, alias: "title" },
  quotedPost: { type: Object },
  attributedTo: { type: Object },
  likes: { type: [Object], default: [] },
  replies: { type: [ReplySchema], default: [] },
  link: { type: String },
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
  circle: { type: String },
  flagged: { type: Boolean, default: false },
  publicCanReply: { type: Boolean, default: false },
  characterCount: { type: Number, default: 0 },
  wordCount: { type: Number, default: 0 },
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
  this.href =
    this.href ||
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
    let group = await Group.findOne({ id: this.partOf });
    this.public = group.public;
    this.audience = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: this.partOf,
      type: "Group",
    };
    this.bcc = Array.from(new Set([...this.bcc, ...group.members]));
  }
  if (this.circle) {
    let circle = await Circle.findOne({ id: this.circle });
    this.public = false;
    this.audience = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: this.circle,
      type: "Circle",
    };
    this.bcc = Array.from(new Set([...this.bcc, ...circle.members]));
  }

  next();
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
