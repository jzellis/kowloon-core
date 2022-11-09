import { Schema, model, models } from "mongoose";

const circleSchema = new Schema({
    name: String,
    user: Schema.Types.ObjectId,
    icon: String,
    active: { type: Boolean, default: true },

    
}, { timestamps: true });

const Circle = models.Circle || model('Circle', circleSchema);

export default Circle;
