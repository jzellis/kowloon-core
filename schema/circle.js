import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import ObjectSchema from "./object.js";
import Settings from "./settings.js";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Actor
 */

const CircleSchema = ObjectSchema.clone();
CircleSchema.add({
  _owner: { type: String, required: true },
});

CircleSchema.post("save", async function (doc) {
  let domain = await Settings.findOne({ name: "domain" });
  let username = doc.actor.preferredUsername;
  doc.id = `${domain.value}/@${username}/c/${this._id}`;

  doc.save();
});

CircleSchema.methods.addActor = async function (actor) {
  let actorId = typeof actor == "object" ? actor.id : actor;
  if (actorId) {
    const accessToken = jwt.sign(
      {
        _id: this.id,
        actorId,
      },
      process.env.JWT_KEY
    );
    this.items.push({
      type: "Relationship",
      subject: actor,
      accessToken,
      created: Date.now(),
      active: true,
    });

    this.save();
  }
};

CircleSchema.methods.removeActor = async function (actor) {
  let actorId = typeof actor == "object" ? actor.id : actor;
  if (actorId) {
    this.items.pull({ subject: actorId });
    this.save();
  }
};

const Circle = mongoose.model("Circle", CircleSchema);

export default Circle;
