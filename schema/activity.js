import mongoose from "mongoose";
import ObjectSchema from "./object.js";
import CollectionSchema from "./collection.js";
import tensify from "tensify";
const vowelRegex = /^[aieouAIEOU].*/;
import User from "./user.js";
import { ObjectId } from "mongoose";
import sanitizeHtml from "sanitize-html";
import { htmlToText } from "html-to-text";

const ActivitySchema = ObjectSchema.clone();

ActivitySchema.add({
  owner: { type: ObjectId, ref: "User", required: true },
  actor: { type: String, required: true },
  "@context": {
    type: String,
    default: "https://www.w3.org/ns/activitystreams",
  },
  object: {
    replies: {
      type: CollectionSchema,
      default: undefined,
    },
    likes: {
      type: CollectionSchema,
      default: undefined,
    },
  },
  public: { type: Boolean, default: undefined },
  _kowloon: {
    isPublic: { type: Boolean, default: false },
    publicCanComment: { type: Boolean, default: false },
    canComment: [String],
    seen: { type: Boolean, default: false },
    delivery: [Object],
  },
});

ActivitySchema.pre("save", async function (next) {
  // This sanitizes and normalizes the activity
  const owner = await User.findOne({ _id: this.owner });
  // This creates the activity's ID
  this.id = `${owner.actor.id}/p/${this._id}`;
  // If the activity object exists and has no id, copy the parent activity id to it
  if (this.object) this.object.id = !this.object.id ? this.id : this.object.id;
  let originalObject = this.object;
  this.public = this._kowloon.isPublic == true ? true : undefined;

  // This converts the actor field to a string of the actor's id, because we don't want to store actor info in the activity (we want to always retrieve it)
  this.actor =
    typeof this.actor != "string" && this.actor.id ? this.actor.id : this.actor;

  // Ditto with the target
  if (this.target)
    this.target =
      typeof this.target != "string" && this.target.id
        ? this.target.id
        : this.target;

  // If there's an object but it doesn't have an attributedTo field, add the activity actor to the object attributedTo field
  if (
    this.object &&
    typeof this.object == "object" &&
    Object.keys(this.object).length > 0 &&
    !this.object.attributedTo
  )
    this.object.attributedTo = this.actor;

  // If the activity has an object and the activity and the object don't have synced to, bto, cc or bcc fields, this syncs them.
  if (this.object && typeof this.object == "object")
    ["to", "bto", "cc", "bcc"].map((i) => {
      if (this[i] && typeof this.object[i] != "array") this[i] = [this[i]];
      if (this.object && this.object[i] && typeof this.object[i] != "array")
        this.object[i] = [this.object[i]];
      if (this.object && this.object[i] && !this[i]) this[i] = this.object[i];
      if (this.object && this.object[i] && this[i])
        this[i] = [...this[i], ...this.object[i]];
      if (this[i] && this[i].length > 0) this[i] = Array.from(new Set(this[i]));
    });

  // This creates the content for the post from the object source field (via the ActivityPub spec)
  // Right now this assumes the source is HTML, but I'll add Markdown later
  if (this.object && this.object.source && !this.object.content) {
    this.object.content =
      !this.object.source.mediaType ||
      this.object.source.mediaType == "text/html"
        ? sanitizeHtml(this.object.source.content)
        : this.object.source.content;
    this.object.summary =
      this.object.summary ||
      htmlToText(this.object.content).split(" ").splice(0, 16).join(" ") + "…";
  }

  // This creates the summaries for the user and general notifications

  let summaryActor;
  let summaryUser = await User.findOne({ "actor.id": this.actor });
  if (!summaryUser) {
    let response = await fetch(this.actor);
    summaryActor = await response.json();
  } else {
    summaryActor = summaryUser.actor;
  }
  let verb = tensify(this.type).past.toLowerCase();
  verb = verb == "created" ? "added" : verb;
  let whatThing = "";
  if (this.object && this.object.type)
    whatThing = `${vowelRegex.test(this.object.type) ? "an" : "a"} ${
      this.object.type
    }`;
  if (!this.object.name && this.result) whatThing = this.result.name;
  let excerpt = "";
  if (this.object && this.object.content)
    excerpt =
      ': "' +
      (this.object.name
        ? this.object.name
        : htmlToText(this.object.content).split(" ").splice(0, 10).join(" ")) +
      (!this.object.name ? "..." : "") +
      '"';
  if (this.object.inReplyTo) {
    verb = "replied to";
    let rresponse = await fetch(this.object.inReplyTo);
    let original = await rresponse.json();
    whatThing = `${vowelRegex.test(original.object.type) ? "an" : "a"} ${
      original.object.type
    }`;
    excerpt =
      ': "' +
      (original.object.name
        ? original.object.name
        : htmlToText(original.object.content)
            .split(" ")
            .splice(0, 10)
            .join(" ")) +
      (!original.object.name ? "..." : "") +
      '"';
  }
  let firstSummary = `You ${verb} ${whatThing}${excerpt}`;
  let secondSummary = `${summaryActor.name} ${verb} ${whatThing}${excerpt}`;
  secondSummary =
    summaryActor.name != whatThing
      ? secondSummary
      : `${whatThing} joined the server`;
  this.summary = { actor: firstSummary, public: secondSummary };

  // This creates totalItems fields for the object replies and likes fields
  if (this.object && this.object.replies)
    this.object.replies.totalItems = this.object.replies.items.length;
  if (this.object && this.object.likes)
    this.object.likes.totalItems = this.object.likes.items.length;

  if (!originalObject) this.object.replies = this.object.likes = undefined;
  next();
});

ActivitySchema.methods.getRecipients = function () {
  let recipients = this.to ? this.to : [];
  recipients = this.bto ? [...recipients, ...this.bto] : recipients;
  recipients = this.cc ? [...recipients, ...this.cc] : recipients;
  recipients = this.bcc ? [...recipients, ...this.bcc] : recipients;

  return Array.from(new Set(recipients));
};

ActivitySchema.methods.canComment = function (id) {
  return this._kowloon.canComment.indexOf(id) != -1;
};

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
