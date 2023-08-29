import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import Group from "./group.js";
import Settings from "./settings.js";
import slugify from "slugify";
const Schema = mongoose.Schema;
const PostSchema = AsObjectSchema.clone();

PostSchema.add({
  actor: { type: String, required: true },
  name: { type: String, required: false, alias: "title" },
  attributedTo: { type: String },
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
    `${(await Settings.findOne({ name: "domain" })).value}/${
      this.actor.split("@")[1]
    }/posts/${this._id}`;

  // This needs to do sanitizing at some point but for now we'll just leave it
  this.content = this.content || this.source.content;
  this.source.mediaType = this.source.mediaType || "text/html";
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
