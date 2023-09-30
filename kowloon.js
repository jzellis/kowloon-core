import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import createServer from "./createServer.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const methodDir = __dirname + `/methods/`;
const Kowloon = {
  settings: {},
  user: null,
  actor: null,
  target: null,
  subject: null,
  sanitizedFields: "-privateKey -_id -__v -bto -bcc -password",
  testing: true,
  redis: null,
  outboxQueue: null,
  connection: {},
  activityVerbs: {
    contentManagement: ["Create", "Delete", "Update"],
    collectionManagement: ["Add", "Move", "Remove"],
    reactions: [
      "Accept",
      "Dislike",
      "Flag",
      "Ignore",
      "Like",
      "Reject",
      "TentativeAccept",
      "TentativeReject",
    ],
    groupManagement: ["Join", "Leave"],
    contentExperience: ["Listen", "Read", "View"],
    relationshipExperience: ["Block", "Follow", "Ignore", "Invite", "Reject"],
    negation: ["Undo"],
  },
};
try {
  const methods = await fs.readdirSync(methodDir);
  for (let j = 0; j < methods.length; j++) {
    let file = methods[j];

    if (!fs.lstatSync(methodDir + file).isDirectory()) {
      let name = file.split(".js")[0];
      let imported = await import(`${methodDir}${file}`);
      let importedMethod = imported.default;
      Object.defineProperty(Kowloon, name, {
        enumerable: true,
        configurable: true,
        value: importedMethod,
      });
    }
  }
} catch (e) {
  console.log(e);
}
await Kowloon.init();

export default Kowloon;
