/**
 * @namespace kowloon
 */
import mongoose from "mongoose";
const Schema = mongoose.Schema;
/** @class Settings */

const SettingsSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed },
    description: String,
    public: { type: Boolean, default: true },
    ui: {
      type: { type: String, default: "text" },
      options: Object,
    },
    deleted: Date,
  },

  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
  }
);

const Settings = mongoose.model("Settings", SettingsSchema);
export default Settings;
