import mongoose from "mongoose";
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;

/**
 * @class Settings
 */
const SettingsSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed },
    description: String,
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", SettingsSchema);

export default Settings;
