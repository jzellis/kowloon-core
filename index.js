import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "redis";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const methodDir = __dirname + `/methods/`;

// Object.prototype.defineMethod = function (methodName, methodBody) {
//   Object.defineProperty(this, methodName, {
//     enumerable: true,
//     configurable: true,
//     value: methodBody,
//   });
// };

const Kowloon = {
  settings: {},
  connection: {},
  user: null,
  actor: null,
  owner: null,
  target: null,
  subject: null,
  sanitizedFields: "-owner -_id -__v -_kowloon -bto -bcc -password",
  testing: true,
  redis: null,
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
