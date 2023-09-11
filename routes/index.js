import express from "express";
import fs from "fs/promises";
import Kowloon from "../kowloon.js";
var router = express.Router();

import indexGetRoute from "./get/index.js";
import outboxGetRoute from "./get/outbox.js";
import userProfileGetRoute from "./get/actor.js";
import userOutboxGetRoute from "./get/userOutbox.js";
import userInboxGetRoute from "./get/userInbox.js";
import postGetRoute from "./get/post.js";
import activityGetRoute from "./get/activity.js";

//Post Routes
import loginPostRoute from "./post/login.js";
const staticPage = await fs.readFile("./index.html", "utf-8");
// import rootGetRoute from "./get/home.js";
// import inboxGetRoute from "./get/inbox.js";
// import outboxGetRoute from "./get/outbox.js";
// import userGetRoute from "./get/user.js";
// import actorsGetRoute from "./get/actors.js";
// import userInboxGetRoute from "./get/userInbox.js";
// import userOutboxGetRoute from "./get/userOutbox.js";
// import adminGetRoute from "./get/admin.js";
// import tagGetRoute from "./get/tags.js";
// import previewRoute from "./get/api/preview.js";

// import activityGetRoute from "./get/activity.js";
// import webfingerGetRoute from "./get/webfinger.js";

// // Post routes
// import rootPostRoute from "./post/home.js";
// import inboxPostRoute from "./post/inbox.js";
// import outboxPostRoute from "./post/outbox.js";
// import userPostRoute from "./post/user.js";
// import loginPostRoute from "./post/login.js";
// import userInboxPostRoute from "./post/userInbox.js";
// import userOutboxPostRoute from "./post/userOutbox.js";
// import adminPostRoute from "./post/admin.js";
// import apiUserRoute from "./post/api/user.js";
// import apiSetupRoute from "./post/api/setup.js";
// import apiUploadRoute from "./post/api/upload.js";

// const staticPage = await fs.readFile("./../client/dist/index.html", "utf-8");

const routes = {
  get: {
    "/": indexGetRoute,
    "/outbox": outboxGetRoute,
    "/@:id": userProfileGetRoute,
    "/@:id/outbox": userOutboxGetRoute,
    "/@:id/inbox": userInboxGetRoute,
    "/posts/:id": postGetRoute,
    "/activities/:id": activityGetRoute,
  },
  post: {
    "/login": loginPostRoute,
  },
};
// const routes = {
//   get: {
//     "/": rootGetRoute,
//     "/outbox": outboxGetRoute,
//     "/inbox": inboxGetRoute,
//     "/tags/:tag": tagGetRoute,
//     "/@:username": userGetRoute,
//     "/@:username/outbox": userOutboxGetRoute,
//     "/@:username/inbox": userInboxGetRoute,
//     "/@:username/posts/:id": activityGetRoute,
//     "/actors": actorsGetRoute,
//     "/.well-known/webfinger": webfingerGetRoute,
//     "/admin/": adminGetRoute,
//     "/api/preview": previewRoute,
//   },
//   post: {
//     // "/": rootPostRoute,
//     // "/outbox": outboxPostRoute,
//     // "/inbox": inboxPostRoute,
//     "/login": loginPostRoute,
//     "/@:username": userPostRoute,
//     "/@:username/outbox": userOutboxPostRoute,
//     "/@:username/inbox": userInboxPostRoute,
//     "/admin/": adminPostRoute,
//     "/api/user": apiUserRoute,
//     "/api/set": apiSetupRoute,
//     "/api/upload": apiUploadRoute,
//   },
// };

/* GET home page. */
router.use(async (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  let token = req.headers.authorization
    ? req.headers.authorization.split("Bearer ")[1]
    : undefined;
  let user = token ? await Kowloon.auth(token) : undefined;
  let actor = await Kowloon.getActor(user.actor);
  req.user = user || undefined;
  req.actor = actor;
  if (
    ["application/activity+json", "application/json"].includes(
      req.headers.accept
    )
  ) {
    for (const [url, route] of Object.entries(routes.get)) {
      router.get(url, route);
    }

    for (const [url, route] of Object.entries(routes.post)) {
      router.post(url, route);
    }
  } else {
    res.setHeader("content-type", "text/html");
    res.send(staticPage);
    // next();
  }
  next();
});

export default router;
