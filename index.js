import createServer from "./createServer.js";
try {
  await createServer();
} catch (e) {
  console.log(e);
}
