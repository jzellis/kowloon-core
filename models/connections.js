import { Schema, model, models } from "mongoose";

const connectionSchema = new Schema({
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

const Connection = models.Connection || model('Connection', connectionSchema);

export default Connection;
