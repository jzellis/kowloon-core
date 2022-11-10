import { Schema, model, models } from "mongoose";

const settingsSchema = new Schema({
    name: String,
    value: Schema.Types.Mixed
    
}, { timestamps: true });

const settings = models.Settings || model('Settings', settingsSchema); 

export default settings;
