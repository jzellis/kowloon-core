import mongoose from "mongoose";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Friend
 */
const FriendSchema = new Schema(
  {
    user: { type: ObjectId, required: true, ref: "User" },
    inviteCode: String,
    accepted: { type: Boolean, default: false },
    username: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    name: String,
    icon: {
      type: { type: String, default: "Image" },
      mediaType: { type: String, default: "image/png" },
      url: String,
    },
    summary: String,
    url: String, // This is the user's homepage, not their URL for accessing their data
    lastAccessed: Date, // The last time the server was queried
    active: { type: Boolean, default: true },
    // These are all ActivityPub required fields
    uniqueId: { type: String, required: true }, // the ActivityPub ID
    inbox: String,
    outbox: String,
    following: String,
    followers: String,
    publicKey: {
      id: String,
      owner: String,
      publicKeyPem: String,
    },
  },
  { timestamps: true }
);
const Friend = mongoose.model("Friend", FriendSchema);

export default Friend;
