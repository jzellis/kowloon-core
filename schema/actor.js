import { generateKeyPairSync } from "crypto";
import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import Settings from "./settings.js";
const Schema = mongoose.Schema;
const ActorSchema = AsObjectSchema.clone();

ActorSchema.add({
  preferredUsername: { type: String, required: true, alias: "username" },
  type: {
    type: String,
    enum: [
      "Application",
      "Group",
      "Organization",
      "Person",
      "Service",
      "Server",
    ],
    default: "Person",
  },
  summary: { type: String, alias: "bio" },
  following: { type: [Object], default: [] },
  followers: { type: [Object], default: [] },
  liked: { type: [Object], default: [] },
  bookmarked: { type: [Object], default: [] },
  blocked: { type: [Object], default: [] },
  circles: { type: [Object], default: [] },
  lastTimelineUpdate: { type: Date, default: Date.now() },
  publicKey: String,
  privateKey: String,
  url: { type: [String], alias: "links" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

ActorSchema.index({
  preferredUsername: "text",
  name: "text",
  summary: "text",
  url: "text",
  "location.name": "text",
});

ActorSchema.pre("save", async function (next) {
  this.id =
    this.id ||
    `@${this.preferredUsername}${
      (await Settings.findOne({ name: "asDomain" })).value
    }`;
  if (!this.publicKey) {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    if (this.circles.length === 0)
      this.circles = [
        {
          name: "Friends",
          summary: "My friends",
          items: [],
        },
      ];
    if (!this.icon)
      this.icon = `${
        (await Settings.findOne({ name: "domain" })).value
      }/icons/avatar.png`;
  }

  next();
});

const Actor = mongoose.model("Actor", ActorSchema);

export default Actor;
