import { Activity } from "../schema/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const methodDir = __dirname + "/inbox/";

const InboxParser = {};

const verbs = await fs.readdirSync(methodDir);
for (let j = 0; j < verbs.length; j++) {
  let file = verbs[j];
  if (!fs.lstatSync(methodDir + file).isDirectory()) {
    let name = file.split(".js")[0];
    let imported = await import(`${methodDir}${file}`);
    let importedMethod = imported.default;
    Object.defineProperty(InboxParser, name, {
      enumerable: true,
      configurable: true,
      value: importedMethod,
    });
  }
}

export default async function handler(activity) {
  InboxParser._this = this;
  activity.owner = activity.owner || this.user._id;
  activity = await Activity.create(activity);
  let created = await InboxParser[activity.type](activity);
  return this.sanitize(activity);
}
