import fs from "fs/promises";
import path from "path";
async function walkDir(dir, result = {}) {
  let list = await fs.readdir(dir);
  for (let item of list) {
    const itemPath = path.join(dir, item);
    if ((await fs.stat(itemPath)).isDirectory()) {
      result[item] = {};
      await walkDir(itemPath, result[item]);
    } else {
      const fileName = path.basename(item, path.extname(item));
      console.log(fileName);
      result[fileName] = item;
      //   result[fileName] = JSON.parse(
      //     await fs.readFile(itemPath, { encoding: "utf-8" })
      //   );
    }
  }
  return result;
}

async function testWalkDir(dir) {
  let result = await walkDir(dir);
  console.log("Result:", JSON.stringify(result, null, 2));
}

testWalkDir("methods");
