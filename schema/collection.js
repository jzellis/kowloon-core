import mongoose from "mongoose";
const Schema = mongoose.Schema;
const CollectionSchema = new Schema(
  {
    id: { type: String, default: "" },
    type: { type: String, default: "Collection" },
    "@context": {
      type: String,
      default: "https://www.w3.org/ns/activitystreams",
    },
    current: { type: String, default: undefined },
    first: { type: String, default: undefined },
    last: { type: String, default: undefined },
    totalItems: { type: Number, default: 0 },
    items: { type: [Object], default: [] },
  },
  {
    strict: false,
    strictPopulate: false,
  }
);

CollectionSchema.pre("save", async function (next) {
  this.totalItems = this.items.length;
  next();
});

export default CollectionSchema;
