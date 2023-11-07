import express from "express";
import fs from "fs/promises";
import mime from "mime";
import Kowloon from "../kowloon.js";
var router = express.Router();

import indexGetRoute from "./get/home.js";
import indexInboxRoute from "./get/inbox.js";

import indexOutboxRoute from "./get/outbox.js";
// import outboxGetRoute from "./get/outbox.js";
import userProfileGetRoute from "./get/users/index.js";
import userOutboxGetRoute from "./get/users/outbox.js";
import userInboxGetRoute from "./get/users/inbox.js";
import userOutboxPostRoute from "./post/users/outbox.js";

import postGetRoute from "./get/post.js";
import activityGetRoute from "./get/activity.js";
import searchRoute from "./get/search.js";

import replyPostRoute from "./post/posts/reply.js";

import groupProfileGetRoute from "./get/groups/index.js";
import groupOutboxGetRoute from "./get/groups/outbox.js";
import groupInboxGetRoute from "./get/groups/inbox.js";

import loginRoute from "./api/login.js";
import uploadRoute from "./api/upload.js";
import previewRoute from "./api/preview.js";

//Post Routes

const staticPage = await fs.readFile("./index.html", "utf-8");

const routes = {
  get: {
    "/": indexGetRoute,
    "/outbox": indexOutboxRoute,

    // "/outbox": outboxGetRoute,
    "/users/:id": userProfileGetRoute,
    "/users/:id/outbox": userOutboxGetRoute,
    "/users/:id/inbox": userInboxGetRoute,
    "/groups/:id": groupProfileGetRoute,
    "/groups/:id/outbox": groupOutboxGetRoute,
    "/groups/:id/inbox": groupInboxGetRoute,
    "/users/:userId/:id": postGetRoute,
    "/posts/:id": postGetRoute,
    "/activities/:id": activityGetRoute,
    "/search/:query": searchRoute,
    "/preview": previewRoute,

    // "/posts/:id": postGetRoute,
    // "/activities/:id": activityGetRoute,
    // "/groups/:id": groupGetRoute,
  },
  post: {
    "/login": loginRoute,
    "/upload": uploadRoute,
    "/users/:id/outbox": userOutboxPostRoute,
    "/posts/:postId/replies": replyPostRoute,
    // "/login": loginPostRoute,
  },
};

/* GET home page. */
router.use(async (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");

  let token = req.headers.authorization
    ? req.headers.authorization.split("Bearer ")[1]
    : undefined;
  if (token && token.length > 0) {
    let user = token ? await Kowloon.auth(token) : undefined;
    req.user = user || null;
  }

  if (
    ["application/activity+json", "application/json"].includes(
      req.headers.accept
    )
  ) {
    for (const [url, route] of Object.entries(routes.get)) {
      router.get(url, route);
      // next();
    }

    for (const [url, route] of Object.entries(routes.post)) {
      router.post(url, route);
      // next();
    }
    next();
  } else {
    if (req.path.split("/")[1] === "public") {
      res.setHeader("content-type", mime.getType(process.cwd() + req.path));
      res.send(await fs.readFile(process.cwd() + req.path));
    } else {
      res.setHeader("content-type", "text/html");
      res.send(staticPage);
    }
  }
});

export default router;
