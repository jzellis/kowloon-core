import { Schema, model, models } from "mongoose";

const circleHomieSchema = new Schema({
    circleId: Schema.ObjectId,
    homieId: Schema.ObjectId,
    active: { type: Boolean, default: true },

    
}, { timestamps: true });

const CircleHomie = models.CircleHomie || model('CircleHomie', circleHomieSchema);

export default CircleHomie;
