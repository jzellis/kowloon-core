import * as dotenv from "dotenv";
import mongoose from "mongoose";
// import { createClient } from "redis";
// import querystring, { escape } from "querystring";
// import Queue from "bull";
import {
  Activity,
  Actor,
  Circle,
  Group,
  Post,
  Settings,
  User,
} from "../../schema/index.js";
import crypto from "crypto";
dotenv.config();

export default async function handler() {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.connection.isConnected = db.connections[0].readyState === 1;
    console.log("Kowloon database connection established");
    // }
    let settings = await Settings.find();
    if (settings.length == 0) {
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048, // Adjust the key length as per your requirements
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });
      let defaults = [
        {
          name: "setup",
          description: "Has the site been set up?",
          value: false,
          editable: false,
          ui: { type: "checkbox" },
        },
        {
          name: "title",
          description: "The title of your site",
          value: "Kowloon.social",
          editable: true,
          ui: { type: "text" },
        },
        {
          name: "description",
          description: "A description of your server",
          value:
            "This is the very first Kowloon server ever! There will be many more to follow.",
          editable: true,
          ui: { type: "text" },
        },
        {
          name: "location",
          description: "Your server's location",
          value: "London, UK",
          editable: true,
          ui: {
            type: "text",
          },
        },
        {
          name: "domain",
          description: "Your site's domain",
          value: "http://localhost:3001",
          editable: true,
          ui: { type: "text" },
        },
        {
          name: "asDomain",
          description: "The ActivityPub domain of your site",
          value: "kowloon.social",
          editable: true,
          ui: { type: "text" },
        },
        {
          name: "uploadDir",
          description: "The directory for uploads",
          value: "./uploads",
          editable: true,
          public: false,
          ui: { type: "text" },
        },
        {
          name: "registrationIsOpen",
          description: "Can anyone create an account on your site?",
          value: false,
          editable: true,
          ui: { type: "checkbox" },
        },
        {
          name: "defaultPronouns",
          description: "The default pronouns for users",
          value: {
            subject: "they",
            object: "them",
            possAdj: "their",
            possPro: "theirs",
            reflexive: "themselves",
          },
          editable: true,
          ui: { type: "select" },
        },
        {
          name: "blockedDomains",
          description: "Blocked domains",
          value: [],
          editable: true,
          public: false,
          ui: { type: "text" },
        },
        {
          name: "publicKey",
          description: "The server's public key",
          value: publicKey,
          editable: false,
          ui: {},
        },
        {
          name: "privateKey",
          description: "The server's private key",
          value: privateKey,
          public: false,
          editable: false,
          ui: {},
        },
        {
          name: "likeEmojis",
          description: "The emojis you can use on this server",
          value: [
            { name: "Like", emoji: "👍" },
            { name: "Love", emoji: "❤️" },
            { name: "Sad", emoji: "😭" },
            { name: "Angry", emoji: "🤬" },
            { name: "Shocked", emoji: "😮" },
            { name: "Puke", emoji: "🤮" },
          ],
          editable: false,
          ui: {},
        },
      ];
      await Promise.all(defaults.map(async (s) => await Settings.create(s)));
      settings = await Settings.find();
    }
    settings.forEach(async (setting) => {
      if (setting.public) this.settings[setting.name] = setting.value;
    });

    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Posts: ${await Post.countDocuments()}`);
    console.log(`Actors: ${await Actor.countDocuments()}`);
    console.log(`Activities: ${await Activity.countDocuments()}`);
    console.log(`Groups: ${await Group.countDocuments()}`);
    console.log(`Circles: ${await Circle.countDocuments()}`);
  } catch (error) {
    return new Error(error);
  }
}
