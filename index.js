import * as dotenv from "dotenv";
import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { Activity, Actor, Circle, Settings } from "./schema/index.js";
import util from "util";

dotenv.config();
const SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @module Kowloon
 */
class kowloon {
  constructor() {
    this.settings = {};
    this.connection = {};
    this.actor = null;
    this.owner = null;
    this.target = null;
    this.subject = null;
  }

  sanitize = (thing) => {
    if (thing) {
      let newThing = thing._doc ? thing._doc : thing;
      for (const [key, value] of Object.entries(newThing)) {
        if (value && value.length == 0) newThing[key] = undefined;
      }
      let fields = ["bto", "bcc", "_id", "_kowloon", "__v", "_owner"];
      fields.forEach((e) => {
        newThing[e] = undefined;
      });
      return newThing;
    }
  };

  setActor = (actor) => {
    this.actor = this.sanitize(actor);
  };
  setTarget = (target) => {
    this.target = this.sanitize(target);
  };
  setSubject = (subject) => {
    this.subject = this.sanitize(subject);
  };

  setOwner = (owner) => {
    this.owner = owner;
  };

  init = async () => {
    console.log("Loading Kowloon....");
    // if (!mongoose.connections[0].readyState) {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.connection.isConnected = db.connections[0].readyState;

    console.log("DB connection established");
    // }

    const settings = await Settings.find({});
    settings.forEach((setting) => {
      this.settings[setting.name] = setting.value;
    });

    return true;
  };

  login = async ({ username, password }) => {
    console.log("Username", username.trim());
    let user = await Actor.findOneAndUpdate(
      { preferredUsername: username },
      { "_kowloon.lastLogin": Date.now() },
      { new: true }
    );
    if (!user) return { error: "User not found on this server" };
    let verify = await user.verifyPassword(password.trim());
    if (!verify) {
      return { error: "Password is incorrect" };
    } else {
      return user._kowloon.accessToken;
    }
  };

  auth = async (token) => {
    const user = await Actor.findOne({ "_kowloon.accessToken": token });
    if (!user) return { error: "Token not authorized" };
    return this.sanitize(user);
  };

  disconnect = () => {
    mongoose.connection.close();
    console.log("Connection closed");
  };

  dbStatus = () => mongoose.connections[0].readyState;

  getActivity = async (query) => {
    if (typeof query === "string") query = { id: query };
    query = this.actor
      ? {
          ...query,
          $or: [
            { "actor.id": this.actor.id },
            { "_kowloon.isPublic": true },
            { bcc: this.actor.id },
            { to: this.actor.id },
            { cc: this.actor.id },
            { bto: this.actor.id },
          ],
        }
      : { ...query, "_kowloon.isPublic": true };
    console.log(query);
    let activity = await Activity.findOne(query);
    if (activity) {
      let canComment = await activity.canComment(this.actor.id);
      if (canComment == true) activity = { ...activity._doc, canComment };
      // return activity;
      return this.sanitize(activity);
    }
  };

  getActivities = async (query, page) => {
    let whichPage = page ? page : 1;
    let limit = page ? 20 : 999;
    if (typeof query === "string") query = { id: query };
    query = this.actor
      ? {
          ...query,
          // "actor.id": this.actor.id,
          $or: [
            // { "actor.id": this.actor.id },
            { "_kowloon.isPublic": true },
            { bcc: this.actor.id },
            { to: this.actor.id },
            { cc: this.actor.id },
            { bto: this.actor.id },
          ],
        }
      : { ...query, "_kowloon.isPublic": true };
    console.log(query);
    let activities = await Activity.find(query);
    // .sort("-created")
    // .skip((page - 1) * 20)
    // .limit(limit);
    activities = [...activities];
    return activities.map((a) => this.sanitize(a));
    // return activities;
  };

  getActor = async (query) => {
    if (typeof query === "string") query = { id: query };
    let actor = await Actor.findOne(query);
    return this.sanitize(actor);
  };

  getActors = async (query) => {
    if (typeof query === "string") query = { id: query };
    let actors = await Actor.find(query);
    actors = [...actors];
    return actors.map((a) => this.sanitize(a));
  };

  getCircle = async (q) => {
    if (!this.owner) return { error: "You must be a user to do this" };
    q = { ...q, "actor.id": this.owner.id };
    return this.sanitize(await Circle.findOne(q));
  };

  getCircles = async (q) => {
    if (!this.owner) return { error: "You must be a user to do this" };
    q = { ...q, "actor.id": this.owner.id };
    let circles = await Circle.find(q).sort("created");
    circles = [...circles];
    return circles.map((a) => this.sanitize(a));
  };

  createActivity = async (a) => {
    if (!this.owner) return { error: "No actor set!" };
    a._owner = this.owner.id;
    try {
      const activity = await Activity.findOneAndUpdate(
        { id: a.id },
        { a },
        { upsert: true, new: true }
      );
      let responses = await activity.deliver();
      return activity;
    } catch (e) {
      return { error: e };
    }
  };

  createActor = async (a) => {
    if (!this.owner) return { error: "No actor set!" };
    a._owner = this.owner.id;
    try {
      return await Actor.findOneAndUpdate(
        { id: a.id },
        { a },
        { upsert: true, new: true }
      );
    } catch (e) {
      return { error: e };
    }
  };

  createCircle = async (a) => {
    if (!this.owner) return { error: "No actor set!" };
    a._owner = this.owner.id;
    try {
      return await Circle.findOneAndUpdate(
        { id: a.id },
        { a },
        { upsert: true, new: true }
      );
    } catch (e) {
      return { error: e };
    }
  };

  createUser = async (a) => {
    let actor = await Actor.create(a);
    this.setActor(actor);
    let circle = await Circle.create({
      _owner: actor.id,
      actor: actor,
      type: "Collection",
      name: "Joshua Ellis's Friends Circle",
      items: [],
    });
    circle.addActor(actor);
    let firstA = await Activity.create({
      _owner: actor.id,
      actor: actor,
      object: actor,
      subject: actor,
      target: [actor],
      type: "Create",
      published: Date.now(),
      summary: "Created Joshua Ellis",
      _kowloon: {
        isPublic: false,
        viewCircles: [circle.id],
        commentCircles: [circle.id],
      },
    });

    await Activity.create({
      _owner: actor.id,
      actor: actor,
      type: "Create",
      object: circle,
      published: Date.now(),
      _kowloon: { isPublic: false },
    });

    return actor;
  };

  updateActor = async (actor) => {
    if (!this.owner || (this.owner && this.owner.id != actor.id))
      return { error: "You do not have permission to do this" };
    return await Actor.findOneAndUpdate(
      { id: actor.id },
      { actor },
      { new: true }
    );
  };

  updateActivity = async (activity) => {
    if (!this.owner || (this.owner && this.owner.id != activity.actor.id))
      return { error: "You do not have permission to do this" };
    return await Activity.findOneAndUpdate(
      { id: activity.id },
      { activity },
      { new: true }
    );
  };

  /********
   *
   *
   *
   *
   *
   *
   */

  reset = async () => {
    await Activity.deleteMany({});
    await Actor.deleteMany({});
    await Circle.deleteMany({});
    try {
      let actor = await this.createUser({
        name: "Admin",
        preferredUsername: "admin",
        summary: "Kowloon Admin",
        location: {
          name: "London, UK",
          type: "Place",
        },
        icon: {
          type: "Image",
          name: "Admin",
          url: `${this.settings.domain}/images/avatars/admin.png`,
        },
        url: [
          {
            type: "Link",
            href: "https://www.zenarchery.com",
            name: "Zenarchery (home page",
          },
        ],
        _kowloon: {
          username: "admin",
          email: "jzellis@gmail.com",
          password: "GoTeamVenture",
          isAdmin: true,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };
}

const Kowloon = new kowloon();
await Kowloon.init();
// await Kowloon.reset();
export default Kowloon;
