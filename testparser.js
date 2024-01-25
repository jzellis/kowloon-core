import Kowloon from "./kowloon.js";
import {
  Activity,
  Actor,
  Circle,
  Group,
  Post,
  Settings,
  User,
} from "./schema/index.js";
import ActivityParser from "./verbs/index.js";
import { faker } from "@faker-js/faker";

const numUsers = 10;
const numPosts = 20;
const numLikes = 5;
const numFollows = 5;
let users = [];
let actors = [];
let posts = [];

const createRandomActor = async () => {
  let firstName = faker.person.firstName();
  let lastName = faker.person.lastName();
  let name = `${firstName} ${lastName}`;
  let username = (
    firstName.slice(0, 1) +
    lastName.replace(/[.,\/#!$%\^&\*;:{}=\-_'`~()]/g, "")
  ).toLowerCase();

  let userActivity = {
    type: "Create",
    objectType: "User",
    object: {
      username,
      name,
      password: Math.random().toString(36).slice(2),
      email: `${username}@gmail.com`,
    },
  };

  let user = await ActivityParser.parse(userActivity);

  let actorActivity = {
    type: "Create",
    objectType: "Actor",
    object: {
      username,
      name,
      user: user.activity.object._id,
    },
  };

  let actor = await ActivityParser.parse(actorActivity);
  return actor.activity.object;
};

const createRandomPost = async (actor) => {
  const postTypes = ["Note", "Article", "Media", "Link"];
  let ptype = postTypes[Math.floor(Math.random() * postTypes.length)];
  let postActivity = {
    type: "Create",
    objectType: "Post",
    actor,
    object: {
      actor,
      type: ptype,
      source: {
        mediaType: "text/html",
        content: "",
      },
    },
    isPublic: true,
  };

  if (ptype != "Note") postActivity.object.name = faker.lorem.sentence();
  if (ptype == "Link") postActivity.object.link = faker.internet.url();
  postActivity.object.source.content = `<p>${
    ptype == "Note"
      ? faker.lorem.paragraph({ min: 1, max: 4 }).slice(0, 500)
      : faker.lorem.paragraphs({ min: 1, max: 8 }, "</p><p>")
  }</p>`;

  let post = await ActivityParser.parse(postActivity);
  return post;
};

process.exit();
