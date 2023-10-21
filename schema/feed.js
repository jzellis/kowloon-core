import mongoose from "mongoose";
import { AsObjectSchema } from "./asobject.js";
import Settings from "./settings.js";
import tensify from "tensify";
const vowelRegex = /^[aieouAIEOU].*/;
const Schema = mongoose.Schema;
const FeedSchema = AsObjectSchema.clone();

FeedSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  if (!this.icon)
    this.icon = `${
      (await Settings.findOne({ name: "domain" })).value
    }/icons/feeds.png`;
  next();
});

const Feed = mongoose.model("Feed", FeedSchema);

export default Feed;
