import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { createClient } from "redis";
import { Activity, User, Settings } from "../schema/index.js";
dotenv.config();

export default async function handler() {
  console.log("Loading Kowloon....");
  // if (!mongoose.connections[0].readyState) {
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  this.connection.isConnected = db.connections[0].readyState;

  console.log("Kowloon database connection established");
  console.log(
    `${await Activity.countDocuments()} activities, ${await User.countDocuments()} users`
  );
  // }

  let settings = await Settings.find();
  if (settings.length == 0) {
    let defaults = [
      {
        name: "setup",
        description: "Has the site been set up?",
        value: false,
      },
      {
        name: "title",
        description: "The title of your site",
        value: "My Kowloon Server",
      },

      {
        name: "domain",
        description: "Your site's domain",
        value: "http://localhost:3001",
      },
      {
        name: "apDomain",
        description: "The ActivityPub domain of your site",
        value: "@localhost:3001",
      },
      {
        name: "uploadDir",
        description: "The directory for uploads",
        value: "./uploads",
      },
      {
        name: "registrationIsOpen",
        description: "Can anyone create an account on your site?",
        value: false,
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
      },
    ];

    await Promise.all(defaults.map(async (s) => await Settings.create(s)));

    settings = await Settings.find();
  }
  settings.forEach((setting) => {
    this.settings[setting.name] = setting.value;
  });

  const client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  this.redis = client;

  let allUsers = await User.find({}, "actor");

  await Promise.all(
    allUsers.map(async (u) => {
      await this.redis.set(this.hash(u.actor.id), JSON.stringify(u.actor));
      return true;
    })
  );
}
