import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import Settings from "./settings.js";
import tensify from "tensify";
const vowelRegex = /^[aieouAIEOU].*/;
const Schema = mongoose.Schema;
const ActivitySchema = AsObjectSchema.clone();

ActivitySchema.set("collection", "activities");

ActivitySchema.remove("type");
ActivitySchema.add({
  type: { type: String, default: "Create", alias: "verb" },
  public: { type: Boolean, default: false },
  object: { type: Object, alias: "post" },
});

ActivitySchema.pre("save", async function (next) {
  this.id =
    this.id ||
    `${(await Settings.findOne({ name: "domain" })).value}/${
      this.actor.split("@")[1]
    }/activities/${this._id}`;

  if (this.object && this.object.to) this.to = this.object.to;
  if (this.object && this.object.cc) this.cc = this.object.cc;
  if (this.object && this.object.bto) this.bto = this.object.bto;
  if (this.object && this.object.bcc) this.bcc = this.object.bcc;
  if (this.object) this.public = this.object.public;
  if (this.object && this.object.audience) this.audience = this.object.audience;

  // If this object and this object has an id, replace the object with the id, so this is a reference to it rather than the entire object
  if (this.object && this.object.id) this.object = this.object.id;

  next();
});

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
