/**
 * @namespace kowloon
 */
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
    if (settings.length === 0) await this._setup();
    settings.forEach(async (setting) => {
      if (setting.public) this.settings[setting.name] = setting.value;
    });

    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Posts: ${await Post.countDocuments()}`);
    console.log(
      `Actors: ${await Actor.countDocuments({ type: { $ne: "Feed" } })}`
    );
    console.log(`Feeds: ${await Actor.countDocuments({ type: "Feed" })}`);
    console.log(`Activities: ${await Activity.countDocuments()}`);
    console.log(`Groups: ${await Group.countDocuments()}`);
    console.log(`Circles: ${await Circle.countDocuments()}`);
  } catch (error) {
    return new Error(error);
  }
}
