import fs from "fs/promises";
import path from "path";
const verbDir = "./verbs";

const Parser = {};

const files = await fs.readdir(verbDir);
for (const file of files) {
  if (file.endsWith(".js")) {
    const moduleName = file.split(".")[0];
    const filePath = path.join(verbDir, file);
    // const moduleName = file.split(".")[0];
    // // Use dynamic import to import the module
    try {
      const module = await import("./" + filePath);

      // // Add the imported module as a method to Parser
      Parser[moduleName] = module;
    } catch (e) {
      console.log(e);
    }
  }
}
console.log(Parser);
export default Parser;
