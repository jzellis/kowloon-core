import mongoose from "mongoose";
const Schema = mongoose.Schema;
const OutboxSchema = new Schema(
  {
    activity: { type: Object, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    delivered: Date,
    response: Object,
  },
  {
    timestamps: true,
    collection: "outbox",
  }
);

const Outbox = mongoose.model("Outbox", OutboxSchema);
export default Outbox;
