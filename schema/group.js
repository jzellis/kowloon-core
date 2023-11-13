import { generateKeyPairSync } from "crypto";
import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import { Settings } from "./index.js";
const GroupSchema = AsObjectSchema.clone();

GroupSchema.add({
  name: { type: String, required: true },
  href: { type: String },
  icon: { type: String },
  description: { type: String, default: "" },
  type: { type: String, default: "Group" },
  members: { type: [Object], default: [], alias: "items" },
  pending: { type: [Object], default: [] },
  creator: { type: String, required: true },
  admins: { type: [String], default: [] },
  moderators: { type: [String], default: [] },
  public: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  blocked: { type: [String], default: [] },
});

GroupSchema.pre("save", async function (next) {
  this.id =
    this.id ||
    `${(await Settings.findOne({ name: "domain" })).value}/groups/${this._id}`;
  this.href =
    this.href ||
    `${(await Settings.findOne({ name: "domain" })).value}/groups/${this._id}`;
  if (this.$isNew && (!this.publicKey || !this.privateKey)) {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 4096,
    });
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  if (!this.admins.includes(this.creator)) this.admins.push(this.creator);
  if (!this.icon)
    this.icon = `${
      (await Settings.findOne({ name: "domain" })).value
    }/icons/group.png`;

  next();
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;
