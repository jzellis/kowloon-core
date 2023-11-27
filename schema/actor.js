/**
 * @namespace kowloon
 */
import { generateKeyPairSync } from "crypto";
import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import { Circle, Settings } from "./index.js";

const Schema = mongoose.Schema;
/** @class Actor */

const ActorSchema = AsObjectSchema.clone();

ActorSchema.add({
  username: { type: String, required: true, alias: "preferredUsername" },
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
  following: { type: Schema.Types.ObjectId, ref: "Circle" },
  followers: { type: Schema.Types.ObjectId, ref: "Circle" },
  groups: { type: [Schema.Types.ObjectId], ref: "Group", default: [] },
  liked: { type: [Object], default: [] },
  bookmarked: { type: [Object], default: [] },
  blocked: { type: [Object] },
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
      defaultView: {
        postType: "",
        circle: "",
      },
      theme: "system",
      pronouns: null,
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
    this.id || this.type != "Feed"
      ? `@${this.preferredUsername}@${
          (await Settings.findOne({ name: "asDomain" })).value
        }`
      : `feed:${this.preferredUsername}@${
          (await Settings.findOne({ name: "asDomain" })).value
        }`;

  if (this.type != "Feed") {
    this.href =
      this.href ||
      `//${(await Settings.findOne({ name: "domain" })).value}/users/${
        this.username
      }`;
  }
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
  }
  if (typeof this.location === "string")
    this.location = {
      name: this.location,
    };

  if (!this.prefs.pronouns)
    this.prefs.pronouns = (
      await Settings.findOne({ name: "defaultPronouns" })
    ).value;

  if (!this.following)
    this.following = (
      await Circle.create({
        creator: this._id,
        name: `${this.name} - Following`,
        description: `Users ${this.name} is following`,
        members: [],
        public: false,
      })
    )._id;

  if (!this.followers)
    this.followers = (
      await Circle.create({
        creator: this._id,
        name: `${this.name} - Followers`,
        description: `${this.name}'s followers`,
        members: [],
        public: false,
      })
    )._id;

  if (this.circles.length === 0)
    this.circles = [
      (
        await Circle.create({
          creator: this._id,
          name: `${this.name}'s Friends`,
          description: `Circle for friends of ${this.name}`,
          members: [],
          public: false,
        })
      )._id,
    ];
  if (!this.icon)
    this.icon = `${
      (await Settings.findOne({ name: "domain" })).value
    }/icons/avatar.png`;

  if (typeof this.location == "string") this.location = { name: this.location };
  next();
});

const Actor = mongoose.model("Actor", ActorSchema);

export default Actor;
