import { Activity } from "../schema/index.js";

export default async function handler(user) {
  await User.findOneAndUpdate({ id: user.id }, { $set: user }, { new: true });
}
