import * as dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const KEY = process.env.JWT_KEY;
/**
 * @class Circle
 */

const CircleSchema = new Schema(
  {
    owner: { type: ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    icon: { type: String, default: "circle.png" },
    description: String,
    deleted: Date,
    members: {
      type: Array,
      fields: [
        { name: "actor", type: ObjectId, ref: "Actor" },
        { name: "accepted", type: Date },
        { name: "deleted", type: Date },
        { name: "inviteCode", type: String, default: "" },
      ],
    },
  },
  { timestamps: true }
);

CircleSchema.methods.inviteMember = async function (actorId) {
  const inviteCode = jwt.sign(
    {
      circleId: this._id,
      actorId: actorId,
      ownerId: this.owner,
    },
    process.env.JWT_KEY
  );
  this.members.push({
    actor: actorId,
    inviteCode: inviteCode,
  });

  await this.save();
  return inviteCode;
};

CircleSchema.methods.acceptInvite = async function (inviteCode) {
  const membership = this.members.find((e, i) => {
    return e.inviteCode == inviteCode;
  });
  this.members[this.members.indexOf(membership)].accepted = Date.now();
  if (this.members[this.members.indexOf(membership)].deleted)
    delete this.members[this.members.indexOf(membership)].deleted;
  this.markModified("members");
  await this.save();
  return true;
};

CircleSchema.methods.removeMember = async function (actorId) {
  const membership = this.members.actor(actorId);
  membership.deleted = Date.now();
  this.save();
};

CircleSchema.methods.isMember = async function (actor) {
  return this.members.find((member) => {
    return (member.actor = actor && member.accepted && !member.deleted);
  });
};

const Circle = mongoose.model("Circle", CircleSchema);

export default Circle;
