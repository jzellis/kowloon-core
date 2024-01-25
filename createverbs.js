import fs from "fs/promises";
import verbs from "./verbs.js";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const camelCase = (str) => str.replace(/-./g, (x) => x[1].toUpperCase());

let importText = "";

let cverbs = verbs.map((v) => capitalize(v));

console.log(cverbs);
