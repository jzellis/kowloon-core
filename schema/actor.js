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
