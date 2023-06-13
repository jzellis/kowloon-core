import { Activity } from "../schema/index.js";
export default async function handler(q) {
  return this.sanitize(
    await Activity.find({
      type: "Create",
      owner: this.user._id,
      "object.inReplyTo": { $exists: false },
    }).sort("-published")
  );
}
