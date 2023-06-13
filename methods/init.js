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

  const settings = await Settings.find({});
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
