import { Schema, model, models } from "mongoose";

const homieSchema = new Schema({
    kId: String,
    username: String,
    displayName: String,
    avatar: Schema.ObjectId,
    url: String,
    lastAccess: Date, // The last time this Kowloon checked this server's feed
    lastUpdated: Date, // The last time this Kowloon's data was updated from their server
    active: { type: Boolean, default: true },
    blocked: { type: Boolean, default: false }

    
}, { timestamps: true });

const Homie = models.Homie || model('Homie', homieSchema);

export default Homie;
