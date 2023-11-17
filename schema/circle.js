/**
 * @namespace kowloon
 */
import mongoose from "mongoose";
import { Settings } from "./index.js";
const Schema = mongoose.Schema;

/** @class Circle */

const CircleSchema = new Schema(
  {
    creator: { type: String, required: true },
    name: { type: String, required: true },
    href: { type: String },
    icon: { type: String },
    description: { type: String, default: "" },
    public: { type: Boolean, default: false },
    members: { type: [Object], default: [] },
  },
  { timestamps: true }
);

CircleSchema.pre("save", async function (next) {
  if (!this.icon)
    this.icon = `${
      (await Settings.findOne({ name: "domain" })).value
    }/icons/circles.png`;

  this.href =
    this.href ||
    `//${(await Settings.findOne({ name: "domain" })).value}/circles/${
      this._id
    }`;
  next();
});

const Circle = mongoose.model("Circle", CircleSchema);

export default Circle;
