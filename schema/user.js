/**
 * @namespace kowloon
 */
import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
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
    name: { type: String, required: true },
    id: String,
    //Our password is hashed with bcrypt
    password: { type: String, required: true },
    email: { type: String, required: true },
    prefs: Object,
    actor: { type: mongoose.Types.ObjectId, ref: "Actor" },
    active: { type: Boolean, default: true },
    blocked: { type: Boolean, default: false },
    lastLogin: Date,
    lastAccessed: Date,
    accessToken: String,
    publicKey: String,
    privateKey: String,
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
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, 10);
  if (this.isNew) {
    this.id =
      this.id ||
      `user:${this._id}@${(await Settings.findOne({ name: "domain" })).value}`;
    this.accessToken = jwt.sign(
      {
        username: this.username,
        _id: this._id,
      },
      process.env.JWT_KEY
    );

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048, // Adjust the key length as per your requirements
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

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

// UserSchema.methods.isAdmin = async function () {
//   return (await Settings.findOne({ name: "serverAdmins" })).value.includes(
//     this._id
//   );
// };

const User = mongoose.model("User", UserSchema);

export default User;
