import mongoose from "mongoose";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Following
 */
const FollowingSchema = new Schema(
  {
    user: { type: ObjectId, required: true, ref: "User" },
    uniqueId: { type: String, index: true, unique: true }, // Like an ActivityPub ID, probably just the URL of the feed or homepage as well
    feedType: { type: String, default: "rss" }, // The type of feed -- RSS, Kowloon, Mastodon, JSON Feed, whatever
    name: { type: String, required: true }, // The name of the feed/person/whatever
    url: String, // The homepage or server or address of the feed, not the feed URL, which is...
    feedUrl: { type: String, required: true },
    icon: { type: String, default: "following.png" }, // Just a URL for it, it has to be just an image, no videos
    description: String,
    lastAccessed: Date,
    publicKey: {
      id: String,
      owner: String,
      publicKeyPem: String,
    },
    apiKey: String, // Unique key for accessing this feed
    active: { type: Boolean, default: true },
    extended: Schema.Types.Mixed, // For everything else that might come later
  },
  { collection: "following", timestamps: true }
);

const Following = mongoose.model("Following", FollowingSchema);

export default Following;
