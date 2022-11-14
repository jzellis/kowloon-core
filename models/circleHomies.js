import { Schema, model, models } from "mongoose";

const circleHomieSchema = new Schema(
  {
    circleId: { type: Schema.ObjectId, ref: "Circle" },
    homieId: { type: Schema.ObjectId, ref: "Homie" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CircleHomie =
  models.CircleHomie || model("CircleHomie", circleHomieSchema);

export default CircleHomie;
