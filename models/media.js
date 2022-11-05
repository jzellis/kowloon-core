import { Schema, model, models } from "mongoose";

const mediaSchema = new Schema({
    url: String,
    title: String,
    description: String,
    active: { type: Boolean, default: true },

    
}, { timestamps: true });

const Media = models.Media || model('Media', mediaSchema);

export default Media;
