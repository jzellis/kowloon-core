import * as dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import { createClient } from "redis";
import querystring, { escape } from "querystring";
import Queue from "bull";
import Settings from "../schema/settings.js";
import Actor from "../schema/actor.js";
import Activity from "../schema/activity.js";
// import Post from "../schema/post.js";
// import Group from "../schema/group.js";
// import Inbox from "../schema/inbox.js";
// import Outbox from "../schema/outbox.js";
import crypto from "crypto";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
import User from "../schema/user.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outgoingMethodDir = __dirname + "/OutgoingActivityParser/";
const incomingMethodDir = __dirname + "/IncomingActivityParser/";

export default async function handler() {
  console.log("Loading Kowloon....");
  // if (!mongoose.connections[0].readyState) {
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
        value: "My Kowloon Server",
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
        value: "@kowloon.social",
        editable: true,
        ui: { type: "text" },
      },
      {
        name: "uploadDir",
        description: "The directory for uploads",
        value: "./uploads",
        editable: true,
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
        editable: false,
        ui: {},
      },
    ];

    await Promise.all(defaults.map(async (s) => await Settings.create(s)));

    settings = await Settings.find();
  }

  settings.forEach(async (setting) => {
    this.settings[setting.name] = setting.value;
  });

  this.redis = createClient();
  this.redis.on("error", (err) => console.log("Redis Client Error", err));
  await this.redis.connect();

  await this.cacheActors();
  await this.cachePosts();
  await this.cacheActivities();
  await this.cacheTimeline();

  if (!(await User.findOne())) {
    let adminPassword = crypto.randomBytes(16).toString("hex");
    let adminUser = await User.create({
      username: "admin",
      name: "Admin",
      password: adminPassword,
      email: "admin@admin.com",
      isAdmin: true,
    });

    let adminActor = await this.addActor({
      username: "admin",
      name: "Admin",
      summary: `${this.settings.title} Admin`,
      location: this.settings.location
        ? { name: this.settings.location }
        : undefined,
      user: adminUser._id,
    });

    await User.findOneAndUpdate(
      { _id: adminUser._id },
      { $set: { actor: adminActor.id } }
    );

    let publicActor = await this.addActor({
      username: "public",
      name: "Public",
      type: "Server",
      summary: `All public posts from ${this.settings.asDomain}`,
      location: this.settings.location
        ? { name: this.settings.location }
        : undefined,
      user: adminUser._id,
    });

    console.log("Admin user password: ", adminPassword);

    this.setActor(adminActor);

    await this.addPost({
      actor: adminActor.id,
      type: "Article",
      title: `Welcome to ${this.settings.title}!`,
      source: {
        content: `<p>Welcome to ${this.settings.title}! This is the first post on this server. This is an <b>Article</b>, which means it can have a title. tags, and all sorts of stuff.</p>`,
      },
      tags: ["welcome", "kowloon", "tutorial"],
      public: true,
    });

    await this.addPost({
      actor: adminActor.id,
      type: "Note",
      source: {
        content: `<p>This is a <b>Note</b>. It's shorter than an Article and has no title, but it can still have text formatting like <i>italics</i>, <b>bold</b> and <u>underline</u>.</p>`,
      },
      public: true,
    });

    await this.addPost({
      actor: adminActor.id,
      type: "Link",
      href: "https://www.kowloon.social",
      title: "Kowloon",
      source: {
        content: `<p>This is a <b>Link</b>. It's normally just a link somewhere else and a description of the link, usually automagically pulled from the page it's linked to.</p>`,
      },
      public: true,
    });

    await this.addPost({
      actor: adminActor.id,
      type: "Image",
      title: "This is an Image",
      source: {
        content: `<p>This is an <b>Image</b>. </p>`,
      },
      image: {
        href: `${this.settings.domain}/images/kitten.jpg`,
        name: "This is a picture of a kitten.",
        mediaType: "image/jpg",
      },
      attachment: [
        {
          href: `${this.settings.domain}/images/kitten.jpg`,
          name: "This is a picture of a kitten.",
          mediaType: "image/jpg",
        },
      ],
      public: true,
    });
  }

  // let html = await fs.readFileSync("./index.html", "utf-8");
  let html = `<!DOCTYPE html>
  <html><head><title>${this.settings.title}</title></head><body><h1>${this.settings.title}</h1><p>${this.settings.description}</p></body></html>`;
  await fs.writeFileSync("./index.html", html);

  // Parser

  // this.OutgoingActivityParser = { _this: this };

  // const outgoingVerbs = await fs.readdirSync(outgoingMethodDir);
  // for (let j = 0; j < outgoingVerbs.length; j++) {
  //   let file = outgoingVerbs[j];
  //   if (!fs.lstatSync(outgoingMethodDir + file).isDirectory()) {
  //     let name = file.split(".js")[0];
  //     let imported = await import(`${outgoingMethodDir}${file}`);
  //     let importedMethod = imported.default;
  //     Object.defineProperty(this.OutgoingActivityParser, name, {
  //       enumerable: true,
  //       configurable: true,
  //       value: importedMethod,
  //     });
  //   }
  // }

  // this.IncomingActivityParser = { _this: this };

  // const incomingVerbs = await fs.readdirSync(incomingMethodDir);
  // for (let j = 0; j < incomingVerbs.length; j++) {
  //   let file = incomingVerbs[j];
  //   if (!fs.lstatSync(incomingMethodDir + file).isDirectory()) {
  //     let name = file.split(".js")[0];
  //     let imported = await import(`${incomingMethodDir}${file}`);
  //     let importedMethod = imported.default;
  //     Object.defineProperty(this.IncomingActivityParser, name, {
  //       enumerable: true,
  //       configurable: true,
  //       value: importedMethod,
  //     });
  //   }
  // }
  // / /Parser

  // this.outboxQueue = new Queue("outbox");
  // this.outboxQueue._this = this;
  // this.outboxQueue.add({}, { repeat: { cron: "*/5 * * * * *" } });
  // this.outboxQueue.process((job, done) => {
  //   this.processOutbox();
  //   done();
  // });
  // this.inboxQueue = new Queue("inbox");
  // this.inboxQueue._this = this;
  // this.inboxQueue.add({}, { repeat: { cron: "*/5 * * * * *" } });
  // this.inboxQueue.process((job, done) => {
  //   this.processInbox();
  //   done();
  // });
}
