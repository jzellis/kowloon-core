import fs from "fs/promises";
import Kowloon from "../kowloon.js";
import { faker } from "@faker-js/faker";
console.time("test");

let domain = "http://localhost:3001";
let headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer `,
};
let endpoints = {
  get: {
    getUser: (userId) => `/users/${userId}`,
    getUserPosts: (userId) => `/users/${userId}/outbox`,
    getUserInbox: (userId) => `/users/${userId}/inbox`,
    getUserCircles: (userId) => `/users/${userId}/circles`,
    getCircle: (circleId) => `/circles/${circleId}`,
    getGroup: (groupId) => `/groups/${groupId}`,
    getGroupPosts: (groupId) => `/groups/${groupId}/outbox`,
  },
  create: {
    createUser: "/users",
    userOutbox: (userId) => `/users/${userId}/outbox`,
    createGroup: "/groups",
  },
};
try {
  await Kowloon.__reset();
  let setup = await Kowloon._setup();
  let numUsers = process.argv[2] || 10;
  let numGroups = process.argv[3] || 10;
  let numPosts = process.argv[4] || 100;

  let adminUser = await Kowloon.login("admin", "admin");
  let invite = await Kowloon.createActivity({
    actor: adminUser.actor.id,
    type: "Invite",
    objectType: "Invitation",
    target: "jzellis@gmail.com",
  });
  let token = invite.invite.token;

  let firstName = faker.person.firstName();
  let lastName = faker.person.lastName();
  let username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(
    /['.,\/#!$%\^&\*;:{}=\-_`~()]/g,
    ""
  );
  let u = {
    username: username,
    password: faker.internet.password(),
    email: faker.internet.email(),
    name: `${firstName} ${lastName}`,
    bio: faker.lorem.sentence(),
    location: `${faker.location.city()}, ${faker.location.countryCode()}`,
  };

  let accept = await Kowloon.createActivity({
    // actor: adminUser.actor.id,
    type: "Accept",
    objectType: "Invitation",
    target: token,
    object: u,
  });

  console.log(accept.user);
  // let testUsers = [];
  // let testGroups = [];
  // let testPosts = [];
  // let testCircles = [];

  // for (let i = 0; i < numUsers; i++) {
  //   let firstName = faker.person.firstName();
  //   let lastName = faker.person.lastName();
  //   let username =
  //     `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(
  //       /['.,\/#!$%\^&\*;:{}=\-_`~()]/g,
  //       ""
  //     );
  //   let u = {
  //     username: username,
  //     password: faker.internet.password(),
  //     email: faker.internet.email(),
  //     name: `${firstName} ${lastName}`,
  //     bio: faker.lorem.sentence(),
  //     location: `${faker.location.city()}, ${faker.location.countryCode()}`,
  //   };

  //   testUsers.push(u);
  // }

  // for (let i = 0; i < numGroups; i++) {
  //   let creator = allActors[Math.floor(Math.random() * allActors.length)].id;
  //   let members = faker.helpers
  //     .arrayElements(allActors, {
  //       min: 1,
  //       max: allActors.length,
  //     })
  //     .map((a) => a.id);
  //   let admins = faker.helpers
  //     .arrayElements(members, {
  //       min: 1,
  //       max: 20,
  //     })
  //     .map((a) => a.id);
  //   let moderators = faker.helpers
  //     .arrayElements(members, {
  //       min: 1,
  //       max: 20,
  //     })
  //     .map((a) => a.id);
  //   let g = {
  //     name: faker.company.name(),
  //     description: faker.lorem.sentence(),
  //     location: `${faker.location.city()}, ${faker.location.countryCode()}`,
  //     public: true,
  //     creator: creator,
  //     members: members,
  //     admins: admins,
  //     moderators: moderators,
  //   };
  //   testGroups.push(g.group);
  // }

  // for (let i = 0; i < numPosts; i++) {
  //   let postActor = allActors[Math.floor(Math.random() * allActors.length)];
  //   let type =
  //     Kowloon.postTypes[Math.floor(Math.random() * Kowloon.postTypes.length)];
  //   const forGroup = Math.random() < 0.5;
  //   const hasTitle = Math.random() < 0.5;
  //   const isPublic = Math.random() < 0.5;
  //   const source = {
  //     content:
  //       type != "Article"
  //         ? faker.lorem.paragraph()
  //         : faker.lorem.paragraphs(Math.floor(Math.random() * 5)),
  //   };
  //   let post = {
  //     type,
  //     actor: postActor.id,
  //     public: isPublic,
  //     source,
  //   };
  //   if (type != "Post" && hasTitle) post.title = faker.lorem.sentence();
  //   if (forGroup == true && groupForPosts) post.partOf = groupForPosts.id;

  //   if (isPublic === false) {
  //     let circle = await Kowloon.getCircle(
  //       postActor.circles[Math.floor(Math.random() * postActor.circles.length)]
  //     );
  //     post.bcc = circle.members.map((a) => a.id);
  //   }

  //   testPosts.push(post);
  // }

  // console.log(testUsers, testGroups, testPosts);
} catch (error) {
  console.error(error);
}
console.timeEnd("test");
process.exit();
