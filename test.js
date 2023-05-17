import Kowloon from "./index.js";

Kowloon.init();
const login = await Kowloon.login("jzellis", "Turing9981!");
const posts = await Kowloon.getPosts({ username: "jzellis" });

Kowloon.disconnect();
console.log(posts);
// console.log("Login", login);
process.exit();
