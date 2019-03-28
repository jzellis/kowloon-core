/** These is the site settings schema. None of this should ever be accessible directly via the API. */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const settingsSchema = new Schema({
    ukid: String, // The unique identifier for this user/instance
    primaryUser: ObjectId, // The main user for the site
    url: String,
    mediaBaseUrl: {
        type: String,
        default: "/media/"
    }, // The base URL for all site media
    theme: { // Theme settings
        headerImg: String // The URI for the site header
    }
}, {
    collection: "settings",
    strict: false,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;