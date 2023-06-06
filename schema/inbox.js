import mongoose from "mongoose";
const Schema = mongoose.Schema;
const InboxSchema = new Schema(
  {
    activity: { type: Object, required: true },
    recipient: { type: String, required: true },
    delivered: Date,
    response: Object,
    responseErrors: Object,
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
    collection: "inbox",
  }
);

const Inbox = mongoose.model("Inbox", InboxSchema);
export default Inbox;
