import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    username: String,
    displayName: String,
    password: String,
    avatar: { type: Schema.ObjectId, ref: 'Media', autopopulate: true },
    profile: { type: Schema.Types.Mixed }, // Mixed because it's open
    prefs: { type: Schema.Types.Mixed },
    lastLogin: Date, // The last time this user logged in
    lastRefresh: Date, // The last time this user refreshed their timeline
    active: { type: Boolean, default: true },
    loginToken: String,

    
}, { timestamps: true });
userSchema.plugin(require('mongoose-autopopulate'));
const User = models.User || model('User', userSchema);

export default User;
