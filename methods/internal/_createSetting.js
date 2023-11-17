/**
 * @namespace kowloon
 */
import { Settings } from "../../schema/index.js";

export default async function (setting) {
  try {
    return await Settings.create(setting);
  } catch (error) {
    return { error };
  }
}
