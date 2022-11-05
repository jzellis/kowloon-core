import { Schema, model, models } from "mongoose";

const circleSchema = new Schema({
    name: String,
    icon: String,
    active: { type: Boolean, default: true },

    
}, { timestamps: true });

const Circle = models.Circle || model('Circle', circleSchema);

export default Circle;
