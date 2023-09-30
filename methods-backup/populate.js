import User from "../schema/user.js";
import Activity from "../schema/activity.js";
import { Actor } from "../schema/actor.js";
import Post from "../schema/post.js";
import Inbox from "../schema/inbox.js";
import Outbox from "../schema/outbox.js";
import Group from "../schema/group.js";
import { faker } from "@faker-js/faker";

export default async function handler(options = { users: 10, posts: 10 }) {
  await User.deleteMany({});
  await Activity.deleteMany({});
  await Actor.deleteMany({});
  await Post.deleteMany({});
  await Inbox.deleteMany({});
  await Outbox.deleteMany({});
  await Group.deleteMany({});

  let adminUser = await this.addUser({
    username: "admin",
    name: "Admin",
    password: "admin",
    email: "admin@admin.com",
    isAdmin: true,
    actor: {
      username: "admin",
      name: "Admin",
      summary: `${this.settings.title} Admin`,
      location: this.settings.location
        ? { name: this.settings.location }
        : undefined,
    },
  });

  for (let i = 0; i < options.users; i++) {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let username = faker.internet.userName({ firstName, lastName });
    let email = faker.internet.email({ firstName, lastName });
    await this.addUser({
      username,
      email,
      name: `${firstName} ${lastName}`,
      password: "12345",
      actor: {
        username,
        type: "Person",
        name: `${firstName} ${lastName}`,
        icon: faker.internet.avatar(),
        bio: faker.lorem.paragraphs({ min: 1, max: 3 }),
      },
    });
  }
  let actors = await Actor.find({});
  await Actor.findOneAndUpdate(
    { preferredUsername: "admin" },
    {
      followers: actors.flatMap((a) =>
        a.preferredUsername != "admin" ? [a.id] : []
      ),
      following: actors.flatMap((a) =>
        a.preferredUsername != "admin" ? [a.id] : []
      ),
    }
  );
  for (let j = 0; j < options.posts; j++) {
    let postTypes = ["Note", "Article", "Media", "Link"];
    let type = postTypes[Math.floor(Math.random() * postTypes.length)];
    let url = faker.image.url();
    let actor = actors[Math.floor(Math.random() * actors.length)].id;
    let post = {
      actor,
      attributedTo: actor,
      type,
      source: { content: "", mediaType: "text/html" },
      public: true,
    };
    if (type != "Note") post.title = faker.lorem.words({ min: 3, max: 10 });
    switch (true) {
      case type == "Note":
        post.source.content = `<p>${faker.lorem.words(
          { min: 2, max: 50 },
          "</p><p<"
        )}</p>`;
        break;
      case type == "Article":
        post.source.content = `<p>${faker.lorem.paragraphs(
          { min: 2, max: 10 },
          "</p><p<"
        )}</p>`;
        break;
      case type == "Media":
        post.attachment = [
          {
            mediaType: "image/jpg",
            url,
          },
        ];
        post.image = url;
        post.source.content = `<p>${faker.lorem.paragraphs(
          { min: 1, max: 3 },
          "</p><p>"
        )}</p>`;
        break;

      case type == "Link":
        href: faker.internet.url();
        post.source.content = `<p>${faker.lorem.paragraphs(
          { min: 1, max: 2 },
          "</p><p>"
        )}</p>`;
        post.image = url;
        break;
    }
    await this.addPost(post);
  }
}
