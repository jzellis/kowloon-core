import mongoose from "mongoose";
import { convert, htmlToText } from "html-to-text";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;
import sanitizeHtml from "sanitize-html";
import Settings from "./settings.js";
import User from "./user.js";

const AsObjectSchema = new Schema(
  {
    id: { type: String },
    type: { type: String },
    content: { type: String, default: undefined },
    name: { type: String, default: undefined },
    closed: Date,
    startTime: Date,
    summary: { type: Object, default: undefined },
    href: { type: String, default: undefined },
    relationship: { type: [String], default: undefined },
    formerType: { type: String, default: undefined },
    deleted: { type: String, default: undefined },
    partOf: { type: [String], default: undefined },
    mediaType: { type: [String], default: undefined },
    duration: { type: String, default: undefined },
    actor: { type: Object, default: undefined },
    attributedTo: { type: [Object], default: undefined },
    audience: { type: Object, default: undefined },
    generator: { type: [Object], default: undefined },
    icon: { type: Object, default: undefined },
    image: { type: Object, default: undefined },
    inReplyTo: { type: String, default: undefined },
    instrument: { type: [Object], default: undefined },
    location: { type: Object, default: undefined },
    oneOf: { type: [Object], default: undefined },
    anyOf: { type: [Object], default: undefined },
    origin: { type: Object, default: undefined },
    preview: { type: [Object], default: undefined },
    result: { type: Object, default: undefined },
    tag: { type: [Object], default: undefined },
    target: { type: Object, default: undefined },
    subject: { type: Object, default: undefined },
    describes: { type: Object, default: undefined },
    url: { type: [Object], default: undefined },
    to: { type: [String], default: undefined },
    bto: { type: [String], default: undefined },
    cc: { type: [String], default: undefined },
    bcc: { type: [String], default: undefined },
    source: { type: Object, default: undefined },
  },
  {
    strict: false,
    strictPopulate: false,
    timestamps: {
      createdAt: "published",
      updatedAt: "updated",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export { AsObjectSchema };
