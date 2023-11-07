import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import { Settings, Group } from "./index.js";
import tensify from "tensify";
import Kowloon from "../kowloon.js";
const vowelRegex = /^[aieouAIEOU].*/;
const Schema = mongoose.Schema;
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
  public: { type: Boolean, default: false },
  object: { type: Object, alias: "post" },
  objectType: { type: String, default: "Post" },
  to: { type: [String], default: [] },
  cc: { type: [String], default: [] },
  bto: { type: [String], default: [] },
  bcc: { type: [String], default: [] },
  audience: { type: [String], default: [] },
});

ActivitySchema.pre("save", async function (next) {
  this.id =
    this.id ||
    `${(await Settings.findOne({ name: "domain" })).value}/activities/${
      this._id
    }`;
  // if (!this.actor) this.actor = "@" + (await Settings.findOne({ name: "domain" })).value;
  if (this.object && this.object.to) this.to = this.object.to;
  if (this.object && this.object.cc) this.cc = this.object.cc;
  if (this.object && this.object.bto) this.bto = this.object.bto;
  if (this.object && this.object.bcc) this.bcc = this.object.bcc;
  if (this.object) this.public = this.object.public;
  if (this.object && this.object.audience) this.audience = this.object.audience;

  // If this object and this object has an id, replace the object with the id, so this is a reference to it rather than the entire object
  if (this.object && this.object.id) this.object = this.object.id;
  if (this.public === true && !this.audience)
    this.audience = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: "https://www.w3.org/ns/activitystreams#Public",
      type: "Collection",
    };

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

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
