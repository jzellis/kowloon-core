import { Activity, Inbox, User } from "../schema/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const methodDir = __dirname + "/inbox/";

const InboxParser = { _this: this };

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

export default async function handler(message) {
  try {
    let user = await User.findOne({ id: message.to });
    if (user) {
      let canSend = user.actor.blocked.items.indexOf(message.from) == -1;
      if (canSend) {
        if (InboxParser[message.activity.type])
          message = await InboxParser[message.activity.type](message);
        return await Inbox.create(message);
      }
    } else {
      console.log("User not found!");
    }
  } catch (e) {
    console.log("Inbox error: ", e);
    return {};
  }
}
