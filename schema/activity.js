import mongoose from "mongoose";
import { convert, htmlToText } from "html-to-text";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;
import Settings from "./settings.js";
import User from "./user.js";
import { ActorSchema } from "./actor.js";
import sanitizeHtml from "sanitize-html";
import Circle from "./circle.js";

const ActivitySchema = new Schema(
  {
    id: { type: String },
    actor: ActorSchema,
    type: String,
    object: {
      id: { type: String },

      type: { type: String, default: "Note" },
      actor: ActorSchema,
      attachment: [
        {
          type: { type: String, default: "Image" },
          content: String,
          url: String,
        },
      ],
      attributedTo: [ActorSchema],
      audience: [ActorSchema],
      content: String,
      context: String,
      name: String,
      endTime: Date,
      generator: {
        type: { type: String, default: "Application" },
        name: { type: String, default: "Kowloon" },
        url: String,
      },
      icon: [
        {
          type: { type: String, default: "Image" },
          name: { type: String, default: "Note Icon" },
          url: { type: String },
        },
      ],
      image: [
        {
          type: { type: String, default: "Image" },
          name: { type: String, default: "Note Icon" },
          url: { type: String },
        },
      ],
      inReplyTo: Schema.Types.Mixed,
      location: Schema.Types.Mixed,
      preview: Schema.Types.Mixed,
      published: { type: Date, default: Date.now() },
      replies: [Schema.Types.Mixed],
      likes: [Schema.Types.Mixed],
      startTime: Date,
      summary: String,
      tags: [String],
      updated: { type: Date, default: Date.now() },
      url: String,
      to: [String],
      bto: [String],
      cc: [String],
      bcc: [String],
      mediaType: { type: String, default: "text/html" },
      duration: String,
      deleted: Date,
    },
    target: ActorSchema,
    summary: String,
    _kowloon: {
      isPublic: { type: Boolean, default: false },
      owner: { type: ObjectId, ref: "User", required: true },
      author: { type: ObjectId, ref: "User" },
      read: Date,
      bookmarked: Date,
      viewCircles: [{ type: ObjectId, ref: "Circle" }],
      commentCircles: [{ type: ObjectId, ref: "Circle" }],
    },
  },
  {
    strict: false,
    strictPopulate: false,
    collection: "activities",
    timestamps: true,
  }
);

ActivitySchema.pre("save", async function (next) {
  this.object.content = sanitizeHtml(this.object.content, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, ...["img", "a"]],
  });
  if (!this.object.summary)
    this.object.summary = htmlToText(
      this.object.content.split("</p>").slice(0, 1) + "</p>"
    );
  next();
});

ActivitySchema.post("save", async function (doc) {
  if (!doc.object.id) {
    let domain = await Settings.findOne({ name: "domain" });
    let user = await User.findOne({ _id: this._kowloon.owner });
    domain = domain.value;
    doc.object.id = `${domain}/@${user.username}/p/${doc._id}`;
  }
  if (!doc.id) {
    let domain = await Settings.findOne({ name: "domain" });
    let user = await User.findOne({ _id: this._kowloon.owner });
    domain = domain.value;
    doc.id = `${domain}/@${user.username}/p/${doc._id}`;
  }
  doc.save();
});

ActivitySchema.methods.getViewCircles = async function () {
  return await Circle.find({
    _id: this._kowloon.viewCircles,
  });
};

ActivitySchema.methods.getCommentCircles = async function () {
  return await Circle.find({
    _id: this._kowloon.commentCircles,
  });
};

ActivitySchema.methods.actorCanView = async function (actorId) {
  let actorCircles = await Circle.find({ "members.actor": actorId }, "_id");
  actorCircles = actorCircles.map((c) => c._id);
  let canView = actorCircles.some((r) =>
    this._kowloon.viewCircles.includes(r.toString())
  );
  return canView;
};

ActivitySchema.methods.actorCanComment = async function (actorId) {
  let actorCircles = await Circle.find({ "members.actor": actorId }, "_id");
  actorCircles = actorCircles.map((c) => c._id);
  return actorCircles.some((r) =>
    this._kowloon.commentCircles.includes(r.toString())
  );
};

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
