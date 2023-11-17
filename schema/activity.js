/**
 * @namespace kowloon
 */
import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import { Settings, Group, Actor } from "./index.js";
import tensify from "tensify";
import Kowloon from "../kowloon.js";
const vowelRegex = /^[aieouAIEOU].*/;
const Schema = mongoose.Schema;
import crypto from "crypto";
/** @constructor Activity */

const ActivitySchema = AsObjectSchema.clone();

ActivitySchema.set("collection", "activities");

ActivitySchema.remove("type");
ActivitySchema.add({
  type: {
    type: String,
    enum: [
      "Accept",
      "Add",
      "Announce",
      "Arrive",
      "Block",
      "Create",
      "Delete",
      "Dislike",
      "Flag",
      "Follow",
      "Ignore",
      "Invite",
      "Join",
      "Leave",
      "Like",
      "Unlike",
      "Listen",
      "Move",
      "Offer",
      "Question",
      "Reject",
      "Read",
      "Remove",
      "TentativeReject",
      "TentativeAccept",
      "Travel",
      "Undo",
      "Update",
      "View",
    ],
    default: "Create",
    alias: "verb",
  },
  public: { type: Boolean, default: true },
  circle: { type: String },
  object: { type: Object, alias: "post" },
  objectType: { type: String, default: "Post" },
  to: { type: [String], default: [] },
  cc: { type: [String], default: [] },
  bto: { type: [String], default: [] },
  bcc: { type: [String], default: [] },
  audience: { type: [String], default: [] },
  signature: Buffer,
});

ActivitySchema.pre("save", async function (next) {
  let actor = await Actor.findOne({ id: this.actor });

  this.id =
    this.id ||
    `${(await Settings.findOne({ name: "domain" })).value}/activities/${
      this._id
    }`;

  this.href =
    this.href ||
    `//${(await Settings.findOne({ name: "domain" })).value}/activities/${
      this._id
    }`;

  this.signature = (await Settings.findOne({ name: "publicKey" })).value;
  // if (!this.actor) this.actor = "@" + (await Settings.findOne({ name: "domain" })).value;
  if (this.object && this.object.to) this.to = this.object.to;
  if (this.object && this.object.cc) this.cc = this.object.cc;
  if (this.object && this.object.bto) this.bto = this.object.bto;
  if (this.object && this.object.bcc) this.bcc = this.object.bcc;
  if (!this.public && this.object && this.object.public)
    this.public = this.object.public;
  if (this.object && this.object.audience) this.audience = this.object.audience;
  if (this.object.partOf) this.partOf = this.object.partOf;

  // If this object and this object has an id, replace the object with the id, so this is a reference to it rather than the entire object

  if (this.object.partOf) {
    let group = await Group.findOne({ id: this.object.partOf });
    this.public = group.public;
    this.bcc = this.bcc
      ? Array.from(new Set([...this.bcc, ...group.members]))
      : [...group.members];
  }

  this.signature = crypto.sign(
    "SHA256",
    Buffer.from(JSON.stringify(this._id)),
    actor.privateKey
  );
  if (this.object && this.object.id) this.object = this.object.id;

  next();
});

ActivitySchema.methods.verifySignature = async function () {
  let actor = await Actor.findOne({ id: this.actor });
  return crypto.verify(
    "SHA256",
    JSON.stringify(this._id),
    actor.publicKey,
    this.signature
  );
};

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
