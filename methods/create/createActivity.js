/**
 * @namespace kowloon
 */
import Kowloon from "../../kowloon.js";
import ActivityParser from "../../verbs/index.js";

export default async function (activity) {
  try {
    return await ActivityParser.parse(activity);
  } catch (error) {
    console.log(error);
    return { error };
  }
}
