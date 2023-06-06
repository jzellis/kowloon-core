import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import ObjectSchema from "./object.js";
import CollectionSchema from "./collection.js";
import Settings from "./settings.js";

/**
 * @class Actor
 */

const ActorSchema = ObjectSchema.clone();
ActorSchema.add({
  owner: String,
  inbox: String,
  outbox: String,
  following: {
    type: CollectionSchema,
    default: {
      type: "OrderedCollection",
      items: [],
    },
  },
  followers: {
    type: CollectionSchema,
    default: {
      type: "OrderedCollection",
      items: [],
    },
  },
  liked: {
    type: CollectionSchema,
    default: {
      type: "OrderedCollection",
      items: [],
    },
  },
  bookmarked: {
    type: CollectionSchema,
    default: {
      type: "OrderedCollection",
      items: [],
    },
  },
  blocked: {
    type: CollectionSchema,
    default: {
      type: "OrderedCollection",
      items: [],
    },
  },
  circles: [CollectionSchema],
  preferredUsername: String,
  type: { type: String, default: "Actor" },
  pronouns: {
    type: Object,
  },
  _kowloon: {
    accessToken: String,
    requestToken: String,
    blocked: Boolean,
  },
});

ActorSchema.set("toJSON", { virtuals: true });
ActorSchema.set("toObject", { virtuals: true });

ActorSchema.pre("save", async function (next) {
  let domain = await Settings.findOne({ name: "domain" });
  if (this.userId) {
    const thisUser = await User.findOne({ _id: this.userId });
    this.following.id = `${domain.value}/@${thisUser.username}/following`;
    this.followers.id = `${domain.value}/@${thisUser.username}/followers`;
    this.likes.id = `${domain.value}/@${thisUser.username}/liked`;
    this.circles.id = `${domain.value}/@${thisUser.username}/circles`;

    this.markModified("following.id");
    this.markModified("followers.id");
    this.markModified("liked.id");
    this.id = this.id ? this.id : `${domain.value}/@${thisUser.username}`;

    this.inbox = this.inbox
      ? this.inbox
      : `${domain.value}/@${thisUser.username}/inbox`;
    this.outbox = this.outbox
      ? this.outbox
      : `${domain.value}/@${thisUser.username}/outbox`;
    this.markModified("inbox");
    this.markModified("outbox");
  }
  let defaultPronouns = await Settings.findOne({ name: "defaultPronouns" });
  defaultPronouns = defaultPronouns.value;
  this.pronouns = this.pronouns ? this.pronouns : defaultPronouns;
  this.markModified("pronouns");
  this._kowloon.accessToken = jwt.sign(
    {
      id: this.id,
      domain,
    },
    process.env.JWT_KEY
  );

  next();
});

export default ActorSchema;
