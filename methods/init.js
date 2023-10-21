import * as dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import { createClient } from "redis";
import querystring, { escape } from "querystring";
import Queue from "bull";
import Settings from "../schema/settings.js";
import Actor from "../schema/actor.js";
import Activity from "../schema/activity.js";
import User from "../schema/user.js";
import Post from "../schema/post.js";
import Group from "../schema/group.js";
import Feed from "../schema/feed.js";
import crypto from "crypto";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const outgoingMethodDir = __dirname + "/OutgoingActivityParser/";
// const incomingMethodDir = __dirname + "/IncomingActivityParser/";

export default async function handler() {
  try {
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
          value: "kowloon.social",
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

    if ((await User.countDocuments()) == 0) {
      let adminUser = await User.create({
        username: "Admin",
        name: "Admin",
        password: "admin",
        email: "admin@kowloon.social",
        isAdmin: true,
      });
      let adminActor = await this.createActor({
        username: "admin",
        name: "Admin",
        user: adminUser._id,
      });
      adminUser.actor = adminActor._id;
      await adminUser.save();

      let firstPost = await this.createPost({
        actor: adminActor.id,
        type: "Note",
        public: true,
        source: {
          content: "This is the <b>very first post</b> on this server!",
          mediaType: "text/html",
        },
      });

      await Activity.create({
        actor: adminActor.id,
        type: "Create",
        summary: `${adminActor.name} (${adminActor.id}) created this server!`,
      });

      await this.createGroup({
        name: "Admin Group",
        description: "Group for admins of this server",
        to: [adminActor.id],
        creator: adminActor.id,
        members: [adminActor.id],
        admins: [adminActor.id],
        moderators: [adminActor.id],
        public: false,
        hidden: true,
      });
    }
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Posts: ${await Post.countDocuments()}`);
    console.log(`Actors: ${await Actor.countDocuments()}`);
    console.log(`Activities: ${await Activity.countDocuments()}`);
    console.log(`Groups: ${await Group.countDocuments()}`);
    console.log(`Feeds: ${await Feed.countDocuments()}`);

    // this.redis = createClient();
    // this.redis.on("error", (err) => console.log("Redis Client Error", err));
    // await this.redis.connect();

    // await this.cacheActors();
    // await this.cachePosts();
    // await this.cacheActivities();
    // await this.cacheTimeline();

    // if (!(await User.findOne())) this.populate();

    // let html = await fs.readFileSync("./index.html", "utf-8");
    //   let html = `<!DOCTYPE html>
    // <html><head><title>${this.settings.title}</title></head><body><h1>${this.settings.title}</h1><p>${this.settings.description}</p></body></html>`;
    //   await fs.writeFileSync("./index.html", html);

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
    // this.outboxQueue.add({}, { repeat: { cron: "*/10 * * * * *" } });
    // this.outboxQueue.process((job, done) => {
    //   this.processOutbox();
    //   done();
    // });
    // this.inboxQueue = new Queue("inbox");
    // this.inboxQueue._this = this;
    // this.inboxQueue.add({}, { repeat: { cron: "*/10 * * * * *" } });
    // this.inboxQueue.process((job, done) => {
    //   this.processInbox();
    //   done();
    // });

    let feeds = await Feed.find();
    await Promise.all(
      feeds.map(async (f) => (await this.getFeedItems(f.id)).id)
    );
  } catch (e) {
    console.log(e);
  }
}
