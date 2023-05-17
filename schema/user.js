import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generateKeyPairSync } from "crypto";
import jwt from "jsonwebtoken";
import { Email } from "./email.js";
import { Actor } from "./actor.js";
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
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    //Our password is hashed with bcrypt
    password: { type: String, required: true },
    email: { type: Email, required: true },
    actor: { type: ObjectId, ref: "Actor" },
    prefs: Schema.Types.Mixed,
    isAdmin: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    lastLogin: Date,
    lastUpdate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

/** This hashes the user password on create and creates a public.private key pair and an API key. */
UserSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, 10);

  next();
});

/** Compares a plaintext password to the user's hashed password and returns true if it's correct and false otherwise. */
UserSchema.methods.comparePassword = async function (plaintext) {
  return await bcrypt.compare(plaintext, this.password);
};

UserSchema.methods.getCircles = async function () {
  return await mongoose.model("Circle").find({ owner: this.id });
};

const User = mongoose.model("User", UserSchema);

export default User;
