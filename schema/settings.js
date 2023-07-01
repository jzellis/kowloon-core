import mongoose from "mongoose";
const Schema = mongoose.Schema;
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
