import mongoose from "mongoose";
const Schema = mongoose.Schema;
const InboxSchema = new Schema(
  {
    activity: { type: Object, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "received",
    },
    collection: "inbox",
  }
);

const Inbox = mongoose.model("Inbox", InboxSchema);
export default Inbox;
