import { Schema, model, models } from "mongoose";

const circleConnectionSchema = new Schema({
    circleId: Schema.ObjectId,
    connectionId: Schema.ObjectId,
    active: { type: Boolean, default: true },

    
}, { timestamps: true });

const CircleConnection = models.CircleConnection || model('CircleConnection', circleConnectionSchema);

export default CircleConnection;
