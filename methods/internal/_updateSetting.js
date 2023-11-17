/**
 * @namespace kowloon
 */
import { Settings } from "../../schema/index.js";

export default async function (setting) {
  try {
    return await Settings.findOneAndUpdate({ name: setting.name }, setting);
  } catch (error) {
    return { error };
  }
}
