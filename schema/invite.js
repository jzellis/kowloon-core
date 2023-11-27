import mongoose from "mongoose";
import { Settings } from "./index.js";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  generateRandomString = function () {
    const alphanumeric =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < 4; i++) {
      let randomIndex = Math.floor(Math.random() * alphanumeric.length);
      result += alphanumeric[randomIndex];
    }

    return result;
  },
  generateRandomStringWithDashes = function () {
    const strings = [];

    for (let i = 0; i < 4; i++) {
      strings.push(generateRandomString());
    }

    return strings.join("-");
  };

const inviteSchema = new Schema(
  {
    id: { type: String },
    user: { type: ObjectId, ref: "User" },
    recipient: String,
    token: { type: String },
    accepted: { type: Boolean, default: false },
    acceptedBy: { type: ObjectId, ref: "Actor" },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

inviteSchema.pre("save", async function (next) {
  this.id =
    this.id ||
    `invite:${this._id}@${(await Settings.findOne({ name: "domain" })).value}`;
  if (this.isNew) this.token = generateRandomStringWithDashes();
  next();
});

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
