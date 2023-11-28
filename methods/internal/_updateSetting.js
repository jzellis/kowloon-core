/**
 * @namespace kowloon
 */
import { Settings } from "../../schema/index.js";

export default async function (setting) {
  try {
    return await Settings.findOneAndUpdate(
      { name: setting.name },
      { $set: setting }
    );
  } catch (error) {
    return { error };
  }
}
