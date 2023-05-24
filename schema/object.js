import mongoose from "mongoose";
import { convert, htmlToText } from "html-to-text";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;
import sanitizeHtml from "sanitize-html";

const ObjectSchema = new Schema(
  {
    id: { type: String, index: true },
    type: { type: String },
    content: String,
    context: String,
    current: String,
    endTime: Date,
    first: String,
    last: String,
    name: String,
    next: String,
    prev: String,
    closed: Date,
    published: Date,
    startTime: Date,
    summary: String,
    accuracy: Number,
    altitude: Number,
    width: Number,
    height: Number,
    latitude: Number,
    longitude: Number,
    radius: Number,
    units: String,
    href: [String],
    startIndex: Number,
    relationship: String,
    formerType: String,
    deleted: String,
    href: String,
    hreflang: String,
    partOf: String,
    mediaType: { type: String, default: "text/html" },
    duration: String,
    actor: Object,
    attachment: [Object],
    attributedTo: [Object],
    audience: [Object],
    generator: [Object],
    icon: Object,
    image: Object,
    inReplyTo: [Object],
    instrument: [Object],
    items: [Object],
    location: [Object],
    object: Object,
    oneOf: [Object],
    anyOf: [Object],
    origin: Object,
    preview: [Object],
    replies: [Object],
    result: Object,
    tag: [Object],
    target: Object,
    subject: Object,
    describes: Object,
    url: [Object],
    to: [Object],
    bto: [Object],
    cc: [Object],
    bcc: [Object],
  },
  {
    strict: false,
    strictPopulate: false,
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
  }
);

ObjectSchema.virtual("totalItems").get(() => this.items.length);

ObjectSchema.pre("save", async function (next) {
  if (this.content) {
    this.content = sanitizeHtml(this.content, {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, ...["img", "a"]],
    });
  }

  if (this.summary) {
    this.summary = sanitizeHtml(this.summary, {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, ...["img", "a"]],
    });
  }
  if (this.name) {
    this.name = htmlToText(this.name);
  }
  next();
});

export default ObjectSchema;
