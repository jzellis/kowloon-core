import mongoose from "mongoose";
import { convert, htmlToText } from "html-to-text";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;
import sanitizeHtml from "sanitize-html";
import Actor from "./actor.js";
import CollectionSchema from "./collection.js";

const ObjectSchema = new Schema(
  {
    id: { type: String },
    type: { type: String, default: "Create" },
    content: { type: String, default: undefined },
    "@context": { type: String, default: undefined },
    current: { type: String, default: undefined },
    endTime: Date,
    first: { type: String, default: undefined },
    last: { type: String, default: undefined },
    name: { type: String, default: undefined },
    next: { type: String, default: undefined },
    prev: { type: String, default: undefined },
    closed: Date,
    startTime: Date,
    summary: { type: Object, default: undefined },
    accuracy: { type: Number, default: undefined },
    altitude: { type: Number, default: undefined },
    width: { type: Number, default: undefined },
    height: { type: Number, default: undefined },
    latitude: { type: Number, default: undefined },
    longitude: { type: Number, default: undefined },
    radius: { type: Number, default: undefined },
    units: { type: String, default: undefined },
    href: { type: String, default: undefined },
    startIndex: { type: Number, default: undefined },
    relationship: { type: [String], default: undefined },
    formerType: { type: String, default: undefined },
    deleted: { type: String, default: undefined },
    href: { type: String, default: undefined },
    partOf: { type: [String], default: undefined },
    mediaType: { type: [String], default: undefined },
    duration: { type: String, default: undefined },
    actor: { type: Object, default: undefined },
    attachment: { type: [Object], default: undefined },
    attributedTo: { type: [Object], default: undefined },
    audience: { type: [Object], default: undefined },
    generator: { type: [Object], default: undefined },
    icon: { type: Object, default: undefined },
    image: { type: Object, default: undefined },
    inReplyTo: { type: [Object], default: undefined },
    instrument: { type: [Object], default: undefined },
    items: { type: [Object], default: undefined },
    location: { type: [Object], default: undefined },
    object: { type: Object, default: undefined },
    oneOf: { type: [Object], default: undefined },
    anyOf: { type: [Object], default: undefined },
    origin: { type: Object, default: undefined },
    preview: { type: [Object], default: undefined },
    replies: CollectionSchema,
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
    source: { type: [Object], default: undefined },
  },
  {
    strict: false,
    strictPopulate: false,
    timestamps: {
      createdAt: "published",
      updatedAt: "updated",
    },
  }
);

ObjectSchema.virtual("totalItems").get(function () {
  if (this.items && this.items.length > 0) return this.items.length;
});

const sanitize = (obj) => {
  if (obj) {
    let newObj = obj._doc ? obj._doc : obj;
    for (const [key, value] of Object.entries(newObj)) {
      if (value && value.length == 0)
        // delete newObj[key];
        newObj[key] = undefined;
    }
    let fields = ["_id", "bto", "bcc", "_kowloon", "__v", "owner"];
    fields.forEach((e) => {
      newObj[e] = undefined;
    });
    return newObj;
  }
};

ObjectSchema.pre("save", async function (next) {
  this.content = this.content
    ? sanitizeHtml(this.content, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, ...["img", "a"]],
      })
    : null;

  if (typeof this.actor != "string") this.actor = sanitize(this.actor);
  if (this.subject && typeof this.subject != "string")
    this.actor = sanitize(this.subject);
  if (this.target && typeof this.target != "string")
    this.target = sanitize(this.target);

  // if (this.summary) {
  //   this.summary = htmlToText(this.summary);
  // }
  // if (this.name) {
  //   this.name = htmlToText(this.name);
  // }
  next();
});

ObjectSchema.methods.getActor = async function (doc) {
  if (typeof doc.actor == "string") {
    let actor = await Actor.findOne({ id: doc.actor });
    if (!actor) {
      let response = await fetch(doc.actor);
      actor = await response.json();
    }
    return actor;
  } else {
    return doc.actor;
  }
};

ObjectSchema.methods.getTarget = async function (doc) {
  if (typeof doc.target == "string") {
    let actor = await Actor.findOne({ id: doc.target });
    if (!actor) {
      let response = await fetch(doc.actor);
      actor = await response.json();
    }
    return actor;
  } else {
    return doc.target;
  }
};

export default ObjectSchema;
