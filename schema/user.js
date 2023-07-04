import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CollectionSchema from "./collection.js";
import ActorSchema from "./actor.js";
import Settings from "./settings.js";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class User
 */
const UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-z0-9_.]+$/, "is invalid"],
      index: true,
    },
    id: String,
    //Our password is hashed with bcrypt
    password: { type: String, required: true },
    email: { type: String, required: true },
    prefs: Object,
    actor: ActorSchema,
    isAdmin: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    blocked: { type: Boolean, default: false },
    lastLogin: Date,
    accessToken: String,
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

/** This hashes the user password on create and creates a public.private key pair and an API key. */
UserSchema.pre("save", async function (next) {
  let domain = (await Settings.findOne({ name: "domain" })).value;
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, 10);

  this.accessToken = jwt.sign(
    {
      username: this.username,
      _id: this._id,
    },
    process.env.JWT_KEY
  );
  this.actor.following.id = `${domain}/@${this.username}/following`;
  this.actor.followers.id = `${domain}/@${this.username}/followers`;
  this.actor.liked.id = `${domain}/@${this.username}/liked`;
  this.actor.bookmarked.id = `${domain}/@${this.username}/bookmarks`;

  this.actor.circles.id = `${domain}/@${this.username}/circles`;
  this.actor.inbox = `${domain}/@${this.username}/inbox`;
  this.actor.outbox = `${domain}/@${this.username}/outbox`;
  this.actor.profile = `${domain}/@${this.username}`;

  this.actor.circles.map((c) => {
    c.id = this.actor.id + "/circles/" + c._id;
    return c;
  });
  next();
});

UserSchema.pre("update", async function (next) {
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, 10);
  next();
});

/** Compares a plaintext password to the user's hashed password and returns true if it's correct and false otherwise. */
UserSchema.methods.verifyPassword = async function (plaintext) {
  return await bcrypt.compare(plaintext, this.password);
};

UserSchema.methods.addFriendToCircle = function (circleId, actor) {
  // console.log(this.actor.circles.filter((c) => c._id == circleId)[0]);
  this.actor.circles.filter((c) => c._id == circleId)[0].items.indexOf(actor) ==
    -1 &&
    this.actor.circles.filter((c) => c._id == circleId)[0].items.push(actor);
  this.save();
};

const User = mongoose.model("User", UserSchema);

export default User;
