/**
 * @namespace kowloon
 */
import { Settings } from "../../schema/index.js";
export default async function handler(query = { public: true }) {
  const response = {};
  const settings = await Settings.find(query);
  settings.map((s) => {
    response[s.name] = s.value;
  });
  return response;
}
