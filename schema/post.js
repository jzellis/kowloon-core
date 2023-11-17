import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import { Actor, Group, Settings, Circle } from "./index.js";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import crypto from "crypto";
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
  signature: Buffer,
});

PostSchema.index({
  source: "text",
  "source.content": "text",
  "location.name": "text",
});

PostSchema.pre("save", async function (next) {
  let actor = await Actor.findOne({ id: this.actor });
  this.id =
    this.id ||
    `${(await Settings.findOne({ name: "domain" })).value}/posts/${this._id}`;
  this.href =
    this.href ||
    `//${(await Settings.findOne({ name: "domain" })).value}/posts/${this._id}`;
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

  this.signature = crypto.sign(
    "SHA256",
    Buffer.from(JSON.stringify(this.source)),
    actor.privateKey
  );
  next();
});

PostSchema.methods.verifySignature = async function () {
  let actor = await Actor.findOne({ id: this.actor });
  return crypto.verify(
    "SHA256",
    JSON.stringify(this.source),
    actor.publicKey,
    this.signature
  );
};

const Post = mongoose.model("Post", PostSchema);

export default Post;
