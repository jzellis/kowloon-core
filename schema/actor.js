import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Circle from "./circle.js";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Actor
 */
const ActorSchema = new Schema(
  {
    id: String,
    type: String,
    name: String,
    preferredUsername: String,
    preferredPronouns: {
      subject: { type: String, default: "they" },
      object: { type: String, default: "them" },
      possAdj: { type: String, default: "their" },
      possPro: { type: String, default: "theirs" },
      reflexive: { type: String, default: "themselves" },
    },
    icon: String,
    url: String,
    inbox: String,
    outbox: String,
    summary: String,
    location: String,
    links: [String],
    _kowloon: {
      active: { type: Boolean, default: true },
      blocked: { type: Boolean, default: false },
      accessToken: { type: String, default: "" },
      owner: { type: ObjectId, required: true, ref: "User" },
    },
  },
  { timestamps: true }
);

ActorSchema.pre("save", async function (next) {
  if (!this.parent()) {
    this._kowloon.accessToken = jwt.sign(
      {
        type: "actor",
        _id: this._id,
        owner: this._kowloon.owner,
      },
      process.env.JWT_KEY
    );
  } else {
    this._kowloon = undefined;
  }
  next();
});

ActorSchema.methods.verifyAccessToken = function (token) {
  let payload = jwt.verify(token, process.env.JWT_KEY);
  return (
    payload._id == this._id &&
    payload.owner == this._kowloon.owner &&
    payload.type == "actor"
  );
};

ActorSchema.methods.circles = async function () {
  return await Circle.find({
    "members.actor": this._id,
    "members.accepted": { $exists: true },
    "members.deleted": { $exists: false },
  });
};

ActorSchema.methods.userCircles = async function (user) {
  return await Circle.find({
    owner: user,
    "members.actor": this._id,
    "members.accepted": { $exists: true },
    "members.deleted": { $exists: false },
  });
};

const Actor = mongoose.model("Actor", ActorSchema);

export { Actor, ActorSchema };
