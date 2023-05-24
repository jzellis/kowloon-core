import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import ObjectSchema from "./object.js";
import Activity from "./activity.js";
import Settings from "./settings.js";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Actor
 */

const ActorSchema = ObjectSchema.clone();
ActorSchema.add({
  _owner: String,
  inbox: String,
  outbox: String,
  preferredUsername: String,
  type: { type: String, default: "Actor" },
  pronouns: {
    type: Object,
    // default: Kowloon.settings.defaultPronouns,
  },
  _kowloon: {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      // required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    password: { type: String },
    accessToken: String,
    email: { type: String },
    prefs: Schema.Types.Mixed,
    active: Boolean,
    blocked: Boolean,
    lastLogin: Date,
  },
});

ActorSchema.pre("save", async function (next) {
  if (this._kowloon && this.isModified("_kowloon.password"))
    this._kowloon.password = bcrypt.hashSync(this._kowloon.password, 10);
  let username = this.preferredUsername
    ? this.preferredUsername
    : this._kowloon.username;
  if (!this.preferredUsername && this._kowloon.username)
    this.preferredUsername = this._kowloon.username;
  let domain = await Settings.findOne({ name: "domain" });
  if (this._kowloon && !this.id)
    this.id = `${domain.value}/@${this._kowloon.username}`;
  if (this._kowloon && !this.inbox)
    this.inbox = `${domain.value}/@${this._kowloon.username}/inbox`;
  if (this._kowloon && !this.outbox)
    this.outbox = `${domain.value}/@${this._kowloon.username}/outbox`;
  let defaultPronouns = await Settings.findOne({ name: "defaultPronouns" });
  defaultPronouns = defaultPronouns.value;
  if (!this.pronouns) this.pronouns = defaultPronouns;
  this.markModified("pronouns");
  if (this._kowloon && !this._kowloon.isAdmin) this._kowloon.isAdmin = false;
  if (this._kowloon && !this._kowloon.active) this._kowloon.active = true;
  if (this._kowloon && !this._kowloon.blocked) this._kowloon.blocked = false;
  if (this._kowloon && this._kowloon.username && !this._kowloon.accessToken) {
    let domain = await Settings.findOne({ name: "domain" });
    this._kowloon.accessToken = jwt.sign(
      {
        id: this.id,
        domain,
      },
      process.env.JWT_KEY
    );
  }
  next();
});

ActorSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this._kowloon.password);
};

ActorSchema.methods.getActivities = async function (query) {
  return await Activity.find({ ...query, "actor.id": this.id });
};

const Actor = mongoose.model("Actor", ActorSchema);

export default Actor;
