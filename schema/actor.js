import { generateKeyPairSync } from "crypto";
import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import { Circle, Settings } from "./index.js";

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
      "Feed",
    ],
    default: "Person",
  },
  summary: { type: String, alias: "bio" },
  following: { type: [Object], default: [] },
  followers: { type: [Object], default: [] },
  liked: { type: [Object], default: [] },
  bookmarked: { type: [Object], default: [] },
  blocked: { type: [Object], default: [] },
  circles: { type: [Schema.Types.ObjectId], default: [], ref: "Circle" },
  lastTimelineUpdate: { type: Date, default: Date.now() },
  publicKey: String,
  privateKey: String,
  url: { type: [String], alias: "links" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  prefs: {
    type: Object,
    default: {
      defaultPostType: "Note",
    },
  },
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
    `@${this.preferredUsername}@${
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
        (
          await Circle.create({
            creator: this._id,
            name: "Admin Friends",
            description: "Circle for friends of Admin",
            members: [],
            public: false,
          })
        )._id,
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
