import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const methodDir = __dirname + `/methods/`;

const Kowloon = {
  settings: {},
  user: null,
  actor: null,
  target: null,
  subject: null,
  sanitizedFields: "-owner -_id -__v -_kowloon -bto -bcc -password",
  testing: true,
  redis: null,
  connection: {},
};

const verbs = await fs.readdirSync(methodDir);
for (let j = 0; j < verbs.length; j++) {
  let file = verbs[j];
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
await Kowloon.init();

export default Kowloon;
