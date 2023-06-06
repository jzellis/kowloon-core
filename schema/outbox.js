import mongoose from "mongoose";
const Schema = mongoose.Schema;
const OutboxSchema = new Schema(
  {
    activity: { type: String, required: true },
    recipient: { type: String, required: true },
    inbox: String,
    delivered: Date,
    response: Object,
    responseErrors: Object,
  },
  {
    timestamps: true,
    collection: "outbox",
  }
);

const Outbox = mongoose.model("Outbox", OutboxSchema);
export default Outbox;
