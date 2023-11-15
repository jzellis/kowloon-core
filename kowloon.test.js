import fs from "fs/promises";
import Kowloon from "./kowloon.js";
import { faker } from "@faker-js/faker";
import { Actor } from "./schema/index.js";
console.time("test");

try {
  //   let numUsers = process.argv[2] || 10;
  //   let numGroups = process.argv[3] || 10;
  //   let numPosts = process.argv[4] || 100;

  //   console.log(parseInt(parseInt(numPosts) + parseInt(numUsers) + 1));

  //   const allUsers = [];
  //   const allActors = [];
  //   const allPosts = [];
  //   const allCircles = [];
  //   const allActivities = [];
  //   const allGroups = [];
  //   await Kowloon.__reset();

  //   let user = await Kowloon._createUser({
  //     username: "test",
  //     password: "test",
  //     email: "test@test.com",
  //     isAdmin: true,
  //     name: "Test User",
  //     bio: "This is a test user",
  //     location: "London, UK",
  //   });

  //   let actor = user.actor;
  //   allUsers.push(user);
  //   allActors.push(actor);

  //   for (let i = 0; i < numUsers; i++) {
  //     let firstName = faker.person.firstName();
  //     let lastName = faker.person.lastName();
  //     let username =
  //       `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(
  //         /['.,\/#!$%\^&\*;:{}=\-_`~()]/g,
  //         ""
  //       );
  //     let u = await Kowloon._createUser({
  //       username: username,
  //       password: faker.internet.password(),
  //       email: faker.internet.email(),
  //       name: `${firstName} ${lastName}`,
  //       bio: faker.lorem.sentence(),
  //       location: `${faker.location.city()}, ${faker.location.countryCode()}`,
  //     });

  //     let uCircle = u.actor.circles[0];
  //     let friends = faker.helpers
  //       .arrayElements(allActors, {
  //         min: 1,
  //         max: allActors.length,
  //       })
  //       .map((a) => a.id);

  //     await Promise.all(
  //       friends.map(async (f) => {
  //         await Kowloon.addActorToCircle(uCircle._id, f);
  //       })
  //     );
  //     allUsers.push(u);
  //     allActors.push(u.actor);
  //   }

  //   console.log(
  //     "Number of users is correct:",
  //     (await Kowloon._countUsers()) === numUsers + 1
  //   );

  //   for (let i = 0; i < numGroups; i++) {
  //     let creator = allActors[Math.floor(Math.random() * allActors.length)].id;
  //     let members = faker.helpers
  //       .arrayElements(allActors, {
  //         min: 1,
  //         max: allActors.length,
  //       })
  //       .map((a) => a.id);
  //     let admins = faker.helpers
  //       .arrayElements(members, {
  //         min: 1,
  //         max: 20,
  //       })
  //       .map((a) => a.id);
  //     let moderators = faker.helpers
  //       .arrayElements(members, {
  //         min: 1,
  //         max: 20,
  //       })
  //       .map((a) => a.id);
  //     let g = await Kowloon.createGroup({
  //       name: faker.company.name(),
  //       description: faker.lorem.sentence(),
  //       location: `${faker.location.city()}, ${faker.location.countryCode()}`,
  //       public: true,
  //       creator: creator,
  //       members: members,
  //       admins: admins,
  //       moderators: moderators,
  //     });
  //     allGroups.push(g.group);
  //   }
  //   console.log(
  //     "Number of groups is correct:",
  //     (await Kowloon._countGroups()) === numGroups
  //   );
  //   let groupForPosts = allGroups[0];

  //   for (let i = 0; i < numPosts; i++) {
  //     let postActor = allActors[Math.floor(Math.random() * allActors.length)];
  //     let type =
  //       Kowloon.postTypes[Math.floor(Math.random() * Kowloon.postTypes.length)];
  //     const forGroup = Math.random() < 0.5;
  //     const hasTitle = Math.random() < 0.5;
  //     const isPublic = Math.random() < 0.5;
  //     const source = {
  //       content:
  //         type != "Article"
  //           ? faker.lorem.paragraph()
  //           : faker.lorem.paragraphs(Math.floor(Math.random() * 5)),
  //     };
  //     let post = {
  //       type,
  //       actor: postActor.id,
  //       public: isPublic,
  //       source,
  //     };
  //     if (type != "Post" && hasTitle) post.title = faker.lorem.sentence();
  //     if (forGroup == true && groupForPosts) post.partOf = groupForPosts.id;

  //     if (isPublic === false) {
  //       let circle = await Kowloon.getCircle(
  //         postActor.circles[Math.floor(Math.random() * postActor.circles.length)]
  //       );
  //       post.bcc = circle.members.map((a) => a.id);
  //     }

  //     let p = await Kowloon.createPost(post);

  //     allPosts.push(p.post);
  //   }
  //   console.log(
  //     "Number of posts is correct:",
  //     (await Kowloon._countPosts()) === numPosts
  //   );
  //   let groupPosts = await Kowloon.getGroupInbox(groupForPosts.id);

  //   let updatedPost = allPosts[Math.floor(Math.random() * allPosts.length)];
  //   await Kowloon.createActivity({
  //     actor: updatedPost.actor,
  //     type: "Update",
  //     objectType: "Post",
  //     target: updatedPost.id,
  //     object: {
  //       source: {
  //         content: "Updated: " + updatedPost.content,
  //         mediaType: "text/html",
  //       },
  //     },
  //   });

  //   let circles = await Kowloon._getCircles();

  //   await Kowloon.addActorToCircle(
  //     circles[Math.floor(Math.random() * circles.length)].id,
  //     allActors[Math.floor(Math.random() * allActors.length)].id
  //   );

  //   console.log(
  //     "total number of activities: " +
  //       parseInt(await Kowloon._countActivities()) ==
  //       parseInt(parseInt(numPosts) + parseInt(numUsers) + 1)
  //   );

  await Actor.deleteMany({ type: "Feed" });

  let actors = JSON.parse(await fs.readFile("feedactors.json", "utf8"));
  await Kowloon.createActor(actors);

  console.log("Retrieving new feed items...");
  let feeds = (await Actor.find({ type: "Feed" }, { id: 1 })).map((f) => f.id);
  console.log(await Kowloon._retrieveFeeds(feeds));
} catch (error) {
  console.error(error);
}
console.timeEnd("test");
process.exit();
