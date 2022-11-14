import { Schema, model, models } from "mongoose";

const logSchema = new Schema(
  {
    message: String,
    user: Schema.ObjectId,
    circle: Schema.ObjectId,
    post: Schema.ObjectId,
    homie: Schema.ObjectId,
    media: Schema.ObjectId,
    comment: Schema.ObjectId,
    setting: Schema.ObjectId,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Log = models.Log || model("Log", logSchema);

export default Log;
