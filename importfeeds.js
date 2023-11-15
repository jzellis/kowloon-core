import fs from "fs/promises";
import Kowloon from "./kowloon.js";
import { Actor } from "./schema/index.js";

await Actor.deleteMany({ type: "Feed" });
let actors = JSON.parse(await fs.readFile("feedactors.json", "utf8"));
await Actor.create(actors);
console.log(
  "All feeds imported: " + actors.length ==
    (await Actor.countDocuments({ type: "Feed" }))
);
process.exit(0);
