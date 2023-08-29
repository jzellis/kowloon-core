import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Settings from "./settings.js";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

const InboxSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    server: { type: String },
    queued: { type: Date, default: Date.now() },
    activity: { type: String, required: true },
    blocked: { type: Boolean, default: false },
    completed: Date,
  },
  {
    collection: "inbox",
  }
);

const Inbox = mongoose.model("Inbox", InboxSchema);
export default Inbox;
