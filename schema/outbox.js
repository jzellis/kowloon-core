import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Settings from "./settings.js";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

const OutboxSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    server: { type: String },
    activity: { type: String, required: true },
    queued: { type: Date, default: Date.now() },
    completed: Date,
    delivered: { type: Boolean, default: false },
    error: Object,
  },
  {
    collection: "outbox",
  }
);

const Outbox = mongoose.model("Outbox", OutboxSchema);
export default Outbox;
