import * as dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generateKeyPairSync } from "crypto";
import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";
import { convert, htmlToText } from "html-to-text";
import Parser from "rss-parser";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { modelToJSONSchema } from "mongoose-jsonschema";
import os from "os";
import tensify from "tensify";

import {
  Activity,
  Circle,
  Actor,
  Media,
  Settings,
  User,
} from "./schema/index.js";

import { faker } from "@faker-js/faker";

import { rootCertificates } from "tls";
dotenv.config();
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;
const parser = new Parser();
const vowelRegex = "^[aieouAIEOU].*";

/**
 * @module Kowloon
 */
class kowloon {
  //the class constructor
  /**
   * constructor description
   * @param  {null} null Has no parameters
   */
  constructor() {
    this.settings = {};
    this.user = null;
    this.key = null;
    this.actor = null;
    this.subject = null;
    this.connection = {};
    this.defaultPronouns = {
      subject: "they",
      object: "them",
      possAdj: "their",
      possPro: "theirs",
      reflexive: "themselves",
    };
  }

  /** init Initializes and retrieves settings */
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
  };

  disconnect = () => {
    mongoose.connection.close();
    console.log("Connection closed");
  };
  /**
   * Logs in a user and returns the user record. This does not mask out passwords or keys, so be careful!
   * @param {String} username the username
   * @param {String} password the password
   * @return {Object} The user object
   */

  dbStatus = () => mongoose.connections[0].readyState;

  setUser = (user) => {
    this.user = user;
  };

  setActor = (user) => {
    this.actor = actor;
  };

  setSubject = (user) => {
    this.subject = user;
  };

  userIsSubject = () => {
    return this.user._id.toString() == this.subject._id.toString();
  };

  login = async (u, p) => {
    console.log("User", u);
    console.log("Password", p);
    try {
      let user = await User.findOne({ username: u });
      if (!user) return new Error("username not found");
      if ((await bcrypt.compare(p, user.password)) == true) {
        const lastLogin = Date.now();
        await User.updateOne({ _id: user._id }, { $set: { lastLogin } });
        user = await User.findOne(
          { _id: user._id },
          { password: 0, __v: 0 }
        ).populate("actor");
        this.setUser(user);
        let token = user.actor._kowloon.accessToken;
        console.log("Token", token);
        return { token, user, lastLogin };
        // return token;
      } else {
        return new Error("incorrect password");
      }
    } catch (e) {
      return new Error(e);
    }
  };

  logout = () => {
    this.setUser(undefined);
  };

  /** Authenticates a user against their API key. */
  auth = async (token) => {
    if (typeof token === "string") {
      try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne(
          { actor: payload._id, active: true },
          { password: 0, __v: 0 }
        ).populate("actor", "-_kowloon.accessToken");
        return user ? { user } : { error: "Actor not found" };
      } catch (e) {
        return new Error(e);
      }
    } else {
      return new Error("Token is not a string");
    }
  };

  verifyUserPermissions = async (user) => {
    user = user ? user : this.user ? this.user : null;
    let isVerified = false;
    const verifiedUser =
      user && user._id ? await User.findOne({ _id: user._id }) : null;
    if (verifiedUser && user) isVerified = true;

    switch (isVerified) {
      case true:
        return { isAdmin: user.isAdmin ? user.isAdmin : false };
        break;
      case false:
        return false;
        break;
    }
  };

  // Create, get, and update Kowlon settings

  createSetting = async ({ name, value, description = "" }, user) => {
    user = user ? user : this.user ? this.user : null;
    if (await this.verifyUserPermissions(user)) {
      const newSetting = await Settings.create({
        name,
        value,
        description,
        createdBy: user._id,
      });
      return {
        name: newSetting.name,
        value: newSetting.value,
        description: newSetting.description,
      };
    }
  };

  getSetting = async (name) => {
    const setting = await Settings.findOne({ name });
    return {
      name: setting.name,
      value: setting.value,
      description: setting.description,
    };
  };

  updateSetting = async ({ name, value, description }, user) => {
    user = user ? user : this.user ? this.user : null;
    if (await this.verifyUserPermissions(user)) {
      const fields = description
        ? { value, description, modifiedBy: user._id }
        : { value, modifiedBy: user._id };
      try {
        const setting = await Settings.findOneAndUpdate(
          { name },
          { $set: fields },
          { new: true }
        );
        return {
          name: setting.name,
          value: setting.value,
          description: setting.description,
        };
      } catch (e) {
        console.log(e);
      }
    } else {
      return false;
    }
  };

  createUser = async (user) => {
    try {
      return await User.create(user);
    } catch (e) {
      return { error: e };
    }
  };

  getUser = async (query) => {
    query = query ? { ...query, active: true } : {};
    try {
      return await User.findOne(query, "-password -__v").populate("actor");
    } catch (e) {
      return { error: e };
    }
  };

  getUsers = async (query) => {
    query = { ...query, active: true };
    try {
      return await User.find(query, "-password -__v").populate("actor");
    } catch (e) {
      return { error: e };
    }
  };

  updateUser = async ({ query, fields }) => {
    fields = fields
      ? {
          ...fields,
          isAdmin: undefined,
          "_kowloon.actor.accessToken": undefined,
        }
      : {};
    try {
      return await User.findOneAndUpdate(
        { query },
        { $set: { fields } },
        { new: true }
      );
    } catch (e) {
      return { error: e };
    }
  };

  removeUser = async ({ _id }) => {
    try {
      await User.findOneAndUpdate({ _id }, { $set: { active: false } });
      return { _id };
    } catch (e) {
      return { error: e };
    }
  };

  createActor = async (actor) => {
    try {
      return await Actor.create(actor);
    } catch (e) {
      return { error: e };
    }
  };

  getActor = async (query) => {
    query = query ? { ...query, active: true } : {};
    try {
      return await Actor.findOne(query, "-kowloon.accessToken -__v");
    } catch (e) {
      return { error: e };
    }
  };

  getActors = async (query) => {
    query = { ...query, active: true };
    try {
      return await Actor.find(query, "-kowloon.accessToken -__v");
    } catch (e) {
      return { error: e };
    }
  };

  updateActor = async ({ query, fields }) => {
    fields = fields ? { ...fields, "_kowloon.accessToken": undefined } : {};
    try {
      return await Actor.findOneAndUpdate(
        { query },
        { $set: { fields } },
        { new: true }
      );
    } catch (e) {
      return { error: e };
    }
  };

  removeActor = async ({ _id }) => {
    try {
      await Actor.findOneAndUpdate({ _id }, { $set: { active: false } });
      return { _id };
    } catch (e) {
      return { error: e };
    }
  };

  /* So, a note here: every activity has to have an actor, and every activity that's posted to Kowloon has an owner, which means the user who created it or for whom it is intended. The Actor object *must* have an id field -- this is non-negotiable. */

  createActivity = async (activity, options) => {
    let actor, target, owner;
    if (options) ({ actor, target, owner } = options);
    let response = {};
    activity._kowloon.owner = owner ? owner : this.user ? this.user._id : null;

    if (owner && owner._kowloon && owner._kowloon.accessToken)
      owner._kowloon.accessToken = undefined;
    let isValid = true;
    activity.actor = activity.actor ? activity.actor : actor ? actor : null;
    if (actor && actor._kowloon && actor._kowloon.accessToken)
      actor._kowloon.accessToken = undefined;
    activity.target = activity.target ? activity.target : this.subject.actor;
    console.log("Target", activity.target);
    if (target && target._kowloon && target._kowloon.accessToken)
      target._kowloon.accessToken = undefined;

    const hasActor = activity.actor ? true : false;
    const hasTarget = activity.target ? true : false;
    const hasOwner = activity._kowloon.owner ? true : false;
    const ActorHasId = activity.actor && activity.actor.id ? true : false;
    const TargetHasId = activity.target && activity.target.id ? true : false;

    if (!ActorHasId || !hasOwner || (activity.target && !TargetHasId))
      isValid = false;

    // If the activity isn't valid, return an error
    if (!isValid) {
      let error = "";
      switch (false) {
        case hasActor:
          error = "Activity must have an actor.";
          break;
        case hasOwner:
          error = "Activity must have an owner.";
          break;
        case ActorHasId:
          error = "Activity actor must have an id.";
          break;
        case activity.target && !TargetHasId:
          "You have specified a target but given no id for the target.";
          break;
      }
      response.error = error;

      // If activity is valid, do things
    } else {
      let adverb = activity.object.type.toLowerCase().match(vowelRegex)
        ? "an"
        : "a";

      // Says "Bob Jones created a note" or whatever
      activity.summary = activity.summary
        ? activity.summary
        : `${activity.actor.name} ${tensify(
            activity.type
          ).past.toLowerCase()} ${adverb} ${activity.object.type.toLowerCase()}`;

      if (!activity.object.actor && !activity.object.attributedTo)
        activity.object.actor = activity.actor;

      try {
        let newActivity = await Activity.create(activity);
        return newActivity;
      } catch (e) {
        response.error = e;
      }
    }
    return response;
  };

  getActivity = async (_id) => {
    let response = {};
    const activity = await Activity.findOne({ _id }, " -__v");

    if (activity) {
      const isPublic = activity._kowloon.isPublic;
      switch (true) {
        // If Kowloon.user is set and the user is the author or owner of the activity
        case this.user &&
          (this.user._id == activity._kowloon.owner ||
            this.user._id == activity._kowloon.author):
          response.activity = activity;
          break;
        // If the post is not public and no user is set:
        case isPublic == false && !this.user:
          response.error = "This post is not public";
          break;
        // If the post isn't public but there is a user, see if the user has access to the activity.
        case !isPublic && this.user.actor._id != undefined:
          if (await activity.actorCanView(this.user.actor._id)) {
            response = activity;
          } else {
            response.error = "You are not authorized to view this post";
          }
          break;
      }
    } else {
      response.error = "No post found";
    }
    return response;
  };

  // Returns activities the user can view.
  getActivities = async (query) => {
    if (!this.user) query = { ...query, _kowloon: { isPublic: true } };
    const response = {};
    // If Kowloon.user is set, get any posts from the query
    let activities = await Activity.find(query, "-_kowloon.owner");
    if (!this.user) {
      activities = await Promise.all(
        activities.map(async (a) => {
          return (await activity.actorCanView(this.user.actor._id)) ? a : null;
        })
      );
    }
    response = activities;
    return response;
  };

  updateActivity = async ({ query, fields }) => {
    fields = fields ? { ...fields, "_kowloon.accessToken": undefined } : {};
    try {
      return await Activity.findOneAndUpdate(
        { query },
        { $set: { fields } },
        { new: true }
      );
    } catch (e) {
      return { error: e };
    }
  };

  removeActivity = async ({ query }) => {
    fields = fields ? { ...fields, "_kowloon.accessToken": undefined } : {};
    try {
      return await Activity.findOneAndUpdate(
        { query },
        {
          $set: {
            summary: "This activity has been deleted",
            "object.type": "Tombstone",
          },
        },
        { new: true }
      );
    } catch (e) {
      return { error: e };
    }
  };

  createCircle = async (circle) => {
    try {
      return await Circle.create(circle);
    } catch (e) {
      return { error: e };
    }
  };

  updateCircle = async ({ query, fields }) => {
    fields = fields ? { ...fields, owner: undefined } : {};
    try {
      return await Circle.findOneAndUpdate(
        { query },
        { $set: { fields } },
        { new: true }
      );
    } catch (e) {
      return { error: e };
    }
  };

  addActorToCircle = async (circleId, actorId) => {
    const circle = await Circle.findOne({ _id: circleId });
    return await circle.inviteMember(actorId);
  };

  // /Kowloon
}
/** kowloon class definition
 */

const Kowloon = new kowloon();
await Kowloon.init();
export default Kowloon;
