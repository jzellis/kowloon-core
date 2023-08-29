import * as dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import { createClient } from "redis";
import querystring, { escape } from "querystring";
import Queue from "bull";
import Settings from "../schema/settings.js";
import Actor from "../schema/actor.js";
import Activity from "../schema/activity.js";
import Post from "../schema/post.js";
import Group from "../schema/group.js";
import Inbox from "../schema/inbox.js";
import Outbox from "../schema/outbox.js";

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
    let defaults = [
      {
        name: "setup",
        description: "Has the site been set up?",
        value: false,
        ui: { type: "checkbox" },
      },
      {
        name: "title",
        description: "The title of your site",
        value: "My Kowloon Server",
        ui: { type: "text" },
      },

      {
        name: "domain",
        description: "Your site's domain",
        value: "http://localhost:3001",
        ui: { type: "text" },
      },
      {
        name: "asDomain",
        description: "The ActivityPub domain of your site",
        value: "@localhost:3001",
        ui: { type: "text" },
      },
      {
        name: "uploadDir",
        description: "The directory for uploads",
        value: "./uploads",
        ui: { type: "text" },
      },
      {
        name: "registrationIsOpen",
        description: "Can anyone create an account on your site?",
        value: false,
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
        ui: { type: "select" },
      },
      {
        name: "blockedDomains",
        description: "Blocked domains",
        value: [],
        ui: { type: "text" },
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

  // await this.populate();

  await this.cacheActors();
  await this.cachePosts();
  await this.cacheActivities();
  await this.cacheTimeline();

  await this.createServer();

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

  // // /Parser

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
