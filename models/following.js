import { Schema, model, models } from "mongoose";

const followingSchema = new Schema(
  {
    name: String,
    description: String,
    avatar: String,
    homeUrl: String,
    feedUrl: String,
    feedType: String,
    active: { type: Boolean, default: true },
    lastAccessed: Date,
    userId: { type: Schema.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Following = models.Following || model("Following", followingSchema);

export default Following;
