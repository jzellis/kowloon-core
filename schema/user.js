import mongoose from "mongoose";
import { Email } from "./email.js";
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
    profile: {
      name: String,
      bio: String,
      location: String,
      links: [String],
    },
    icon: String,
    prefs: Schema.Types.Mixed,
    active: { type: Boolean, default: true },
    apiKey: String,
    publicKey: String,
    privateKey: String,
    lastLogin: Date,
    lastTimelineUpdate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

/** This hashes the user password on create and creates a public.private key pair and an API key. */
UserSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, 10);
  if (!this.publicKey) {
    const pair = await generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: "top secret",
      },
    });

    this.publicKey = pair.publicKey;
    this.privateKey = pair.privateKey;
  }
  if (!this.apiKey)
    this.apiKey = Array.from(Array(64), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");
  next();
});

/** Compares a plaintext password to the user's hashed password and returns true if it's correct and false otherwise. */
UserSchema.methods.comparePassword = async function (plaintext) {
  return await bcrypt.compare(plaintext, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
