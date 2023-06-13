import mongoose from "mongoose";
import ObjectSchema from "./object.js";
import CollectionSchema from "./collection.js";
import tensify from "tensify";
const vowelRegex = /^[aieouAIEOU].*/;
import User from "./user.js";
import { ObjectId } from "mongoose";
import sanitizeHtml from "sanitize-html";
import { htmlToText } from "html-to-text";
import Settings from "./settings.js";

const webfinger = (id) =>
  `http://${id.split("@")[2]}/.well-known/webfinger?resource=acct:${id}`;

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
      default: {
        type: "OrderedCollection",
        items: [],
      },
    },
    likes: {
      type: CollectionSchema,
      default: undefined,
    },
  },
  public: { type: Boolean, default: false },
  publicCanComment: { type: Boolean, default: false },
  whoCanComment: [String],
});

ActivitySchema.pre("save", async function (next) {
  const fullDomain = (await Settings.findOne({ name: "domain" })).value;
  let domain = fullDomain.split("://")[1];
  const owner = await User.findOne({ _id: this.owner });

  //Normalize everything
  this.id = `${fullDomain}/@${owner.username}/posts/${this._id}`;
  this.actor = owner.actor.id;

  // If this has an Object that's an object, not a string, do this stuff
  if (
    this.object &&
    typeof this.object == "object" &&
    Object.keys(this.object).length > 0
  ) {
    this.object.published = this.published;
    this.object.attributedTo = this.object.attributedTo
      ? this.object.attributedTo
      : this.actor;

    this.object.actor = this.object.actor ? this.object.actor : this.actor;

    // These fields should be identical on both the main Activity object and its object object
    if (this.object.inReplyTo && !this.inReplyTo)
      this.inReplyTo = this.object.inReplyTo;
    if (this.inReplyTo && !this.object.inReplyTo)
      this.object.inReplyTo = this.inReplyTo;
    if (!this.object.id) this.object.id = this.id;

    //If the object doesn't have a replies field, create one
    this.object.replies = this.object.replies || {
      type: "OrderedCollection",
      totalItems: 0,
      items: [],
    };

    this.object.likes = this.object.likes || {
      type: "OrderedCollection",
      totalItems: 0,
      items: [],
    };

    ["to", "bto", "cc", "bcc"].map((i) => {
      // If the object to/bto/cc/bcc isn't an array. make it an array
      if (this[i] && typeof this.object[i] != "array") this[i] = [this[i]];
      if (this.object && this.object[i] && typeof this.object[i] != "array")
        this.object[i] = [this.object[i]];
      // If the activity to/bto/cc/bcc doesn't exist but the object has them, create them on the activity

      if (this.object && this.object[i] && !this[i]) this[i] = this.object[i];
      if (this.object && this.object[i] && this[i])
        this[i] = [...this[i], ...this.object[i]];
      if (this[i] && this[i].length > 0) this[i] = Array.from(new Set(this[i]));
    });

    // Create the content from the source if it exists
    if (this.object.source && !this.object.content) {
      this.object.source.mediaType =
        this.object.source.mediaType || "text/html";

      this.object.content = this.object.source.content;
      // !this.object.source.mediaType ||
      // this.object.source.mediaType == "text/html"
      //   ? sanitizeHtml(this.object.source.content, {
      //       allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      //       allowedAttributes: {
      //         img: ["src"],
      //       },
      //     })
      //   : this.object.source.content;
      this.object.summary =
        this.object.summary ||
        htmlToText(this.object.content).split(" ").splice(0, 16).join(" ") +
          "…";
    }
  }

  // Now let's handle the summary
  let response,
    target,
    targetActor,
    verb,
    article,
    excerpt,
    summary,
    preposition;
  const defaultPronouns = (await Settings.findOne({ name: "defaultPronouns" }))
    .value;
  let possAdj = defaultPronouns.possAdj;

  if (this.target) {
    response = await fetch(this.target);
    let targetPost = await response.json();
    response = await fetch(webfinger(targetPost.actor));
    targetActor = await response.json();
  }

  article = vowelRegex.test(this.object.type) ? "an" : "a";
  excerpt = this.object.name || this.object.content || null;

  switch (true) {
    case this.type == "Create":
      verb = "Add";
      break;
    case owner.actor.pronouns && owner.actor.pronouns.possAdj:
      possAdj = owner.actor.pronouns.possAdj;
      break;
    case this.inReplyTo:
      verb = "Reply";
      preposition = "to";
      excerpt = this.target.object.name || this.object.target.content || null;
      break;
  }
  verb = verb ? tensify(verb).past.toLowerCase() : null;
  excerpt = `${
    excerpt ? htmlToText(excerpt).split(" ").splice(0, 10).join(" ") : ""
  }`;

  summary = `${verb} ${article} ${preposition || ""}${
    targetActor ? targetActor + "'s " : ""
  }${this.object.type}${excerpt ? ": " + excerpt : " "}${
    !this.object.name ? "..." : ""
  }`;
  this.summary = {
    you: "You " + summary,
    others: owner.actor.name + " " + summary,
  };
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
