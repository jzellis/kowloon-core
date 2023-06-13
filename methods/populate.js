import { KeyObject } from "crypto";
import { Activity, User, Inbox, Outbox } from "../schema/index.js";
import { faker } from "@faker-js/faker";

const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
};

export default async function handler(
  options = { howManyUsers: 100, howManyActivities: 500, howManyReplies: 1000 }
) {
  const { howManyUsers, howManyActivities, howManyReplies } = options;
  const objectTypes = ["Note", "Article", "Image", "Link"];

  let response = {};
  let status = 200;

  await this.reset();

  let jzellis = await User.findOne({ username: "jzellis" });

  for (let i = 0; i < howManyUsers; i++) {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    await this.createUser({
      username: faker.internet.userName({ firstName, lastName }),
      password: "12345",
      email: faker.internet.email({ firstName, lastName }),
      name: `${firstName} ${lastName}`,
      summary: faker.person.bio(),
      location: faker.location.city(),
      urls: [faker.internet.url()],
      icon: faker.image.avatar(),
    });
  }

  await User.updateMany(
    { username: { $ne: "jzellis" } },
    {
      $push: { "actor.following.items": jzellis.actor.id },
      $inc: { "actor.following.totalItems": 1 },
      $push: { "actor.followers.items": jzellis.actor.id },
      $inc: { "actor.followers.totalItems": 1 },
    }
  );

  let allUsers = User.find({ username: { $ne: "jzellis" } }, "id");
  allUsers = (await allUsers).map((a) => a.id);

  await User.findOneAndUpdate(
    { id: jzellis.id },
    {
      $set: {
        "actor.followers.items": allUsers,
        "actor.followers.totalItems": allUsers.length,
        "actor.following.items": allUsers,
        "actor.following.totalItems": allUsers.length,
      },
    }
  );

  for (let i = 0; i < howManyActivities; i++) {
    let allUsers = await User.find();
    let theUser = allUsers[Math.floor(Math.random() * allUsers.length)];

    let activity = {
      type: "Create",
      actor: theUser.id,
      object: {
        type: faker.helpers.arrayElement(objectTypes),
        name: "",
        content: `<p>${faker.lorem.sentences({ min: 1, max: 4 })}</p>`,
      },
      public: true,
      publicCanComment: true,
    };
    if (activity.object.type != "Note") {
      activity.object.name = titleCase(faker.lorem.words({ min: 2, max: 10 }));
      activity.object.content = `<p>${faker.lorem.paragraphs(
        { min: 2, max: 8 },
        "</p><p>"
      )}</p>`;
    }
    if (activity.object.type == "Image") {
      let attachments = [];
      for (let j = 0; j < 3; j++) {
        attachments.push({
          name: titleCase(faker.lorem.words({ min: 2, max: 8 })),
          url: faker.image.url(),
        });
      }
      activity.object.image = attachments[0];
      activity.object.attachment = attachments;
    }

    if (activity.object.type == "Link") {
      let linkTitle = titleCase(faker.lorem.words({ min: 2, max: 8 }));
      activity.object.link = { name: linkTitle, url: faker.internet.url() };
      activity.object.name = linkTitle;
    }

    if (activity.object.type == "Activity") {
      activity.object.tags = faker.helpers.multiple(faker.lorem.word, {
        count: { min: 0, max: 8 },
      });
    }
    this.setUser(theUser);
    try {
      await this.addToOutbox(activity);
    } catch (e) {
      console.log(e);
    }
  }

  let allActivities = await Activity.find();
  for (let i = 0; i < howManyReplies; i++) {
    let inReplyTo = faker.helpers.arrayElement(allActivities).id;
    let allUsers = await User.find();
    let theUser = allUsers[Math.floor(Math.random() * allUsers.length)];

    this.setUser(theUser);
    await this.addToOutbox({
      type: "Create",
      inReplyTo,
      actor: theUser.actor.id,
      object: {
        type: "Note",
        content: faker.lorem.text(),
      },
      public: true,
      publicCanComment: true,
    });
  }
  return true;
}
