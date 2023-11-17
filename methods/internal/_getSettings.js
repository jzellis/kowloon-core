/**
 * @namespace kowloon
 */
import { Settings } from "../../schema/index.js";
export default async function handler(showHidden = false) {
  const response = {};
  const query = showHidden === true ? {} : { public: true };
  const settings = await Settings.find(query);
  settings.map((s) => {
    response[s.name] = s.value;
  });
  return response;
}
