import Actor from "../schema/actor.js";
import User from "../schema/user.js";
import Activity from "../schema/activity.js";
import Post from "../schema/post.js";
import { faker } from "@faker-js/faker";
import Group from "../schema/group.js";
import Inbox from "../schema/inbox.js";
import Outbox from "../schema/outbox.js";

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

export default async function handler(numUsers = 10, numPosts = 20) {
  await User.deleteMany({});
  await Actor.deleteMany({});
  await Activity.deleteMany({});
  await Post.deleteMany({});
  await Group.deleteMany({});
  await Inbox.deleteMany({});
  await Outbox.deleteMany({});

  const user = await User.create({
    username: "jzellis",
    name: "Joshua Ellis",
    email: "jzellis@gmail.com",
    password: "12345",
    isAdmin: true,
  });

  const actor = await Actor.create({
    user: user._id,
    preferredUsername: "jzellis",
    name: "Joshua Ellis",
    summary: "Creator of Kowloon.",
    location: {
      name: "Watford, UK",
    },
    url: [
      "https://www.zenarchery.com",
      "https://www.kowloon.social",
      "https://www.twitter.com/jzellis",
    ],
  });

  user.actor = actor.id;
  await user.save();

  const note = {
    actor: actor.id,
    attributedTo: actor.id,
    type: "Note",
    source: {
      content:
        "<p>This is a Note. It's like a tweet or a FB post, but it has <i>text</i> <b>formatting</b>.</p>",
    },
    public: true,
  };

  const post = {
    actor: actor.id,
    attributedTo: actor.id,
    type: "Post",
    title: "This is a post",
    source: {
      content: `<p>This is a Post. It's a longer piece of text that can be formatted like an essay or blog post.</p>
                <p>I can include <a href="http://www.google.com" target="_blank">links</a> or even <img src="https://placehold.co/600x400" alt="A placeholder" /> images.</p>
                <p>It can be as long as you like. This is filler text.</p>

                <p>My money's in that office, right? If she start giving me some bullshit about it ain't there, and we got to go someplace else and get it, I'm gonna shoot you in the head then and there. Then I'm gonna shoot that bitch in the kneecaps, find out where my goddamn money is. She gonna tell me too. Hey, look at me when I'm talking to you, motherfucker. You listen: we go in there, and that nigga Winston or anybody else is in there, you the first motherfucker to get shot. You understand? </p>

                <p>Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing. </p>

                <p>My money's in that office, right? If she start giving me some bullshit about it ain't there, and we got to go someplace else and get it, I'm gonna shoot you in the head then and there. Then I'm gonna shoot that bitch in the kneecaps, find out where my goddamn money is. She gonna tell me too. Hey, look at me when I'm talking to you, motherfucker. You listen: we go in there, and that nigga Winston or anybody else is in there, you the first motherfucker to get shot. You understand? </p>

                <p>Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw Antwone into a glass motherfuckin' house, fuckin' up the way the nigger talks. Motherfucker do that shit to me, he better paralyze my ass, 'cause I'll kill the motherfucker, know what I'm sayin'? </p>`,
    },
    public: false,
    // This means it has a featured image
    image: {
      href: "https://loremflickr.com/1024/480",
      mediaType: "image/jpg",
    },
  };

  const media = {
    actor: actor.id,
    attributedTo: actor.id,
    type: "Media",
    source: {
      content:
        "<p>This is Media. It's one or more media files -- images, audio, video -- with a description.</p>",
    },
    attachment: [
      {
        href: "https://baconmockup.com/640/360",
        mediaType: "image/jpg",
        name: "This is a picture of bacon.",
      },
      {
        href: "https://www.youtube.com/embed/ScMzIvxBSi4?si=Br3EypUGjunVUCBu&amp;controls=0",
        mediaType: "video/mp4",
        name: "This is a placeholder video.",
      },
      {
        href: "https://file-examples.com/wp-content/storage/2017/11/file_example_MP3_5MG.mp3",
        mediaType: "audio/mp3",
        name: "This is a placeholder music file.",
      },
    ],
    image: {
      href: "https://baconmockup.com/640/360",
      mediaType: "image/jpg",
      summary: "This is the Media's featured image.",
    },
    public: true,
  };

  const link = {
    actor: actor.id,
    attributedTo: actor.id,
    type: "Link",
    href: "https://en.wikipedia.org/wiki/Parliament-Funkadelic",
    source: {
      content:
        "<p>This is a Link. It's just a link to something else with this optional description.</p>",
    },
    image: {
      href: "https://socialsharepreview.com/api/image-proxy?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F2%2F2d%2FGeorge_Clinton_2006.jpg%2F1200px-George_Clinton_2006.jpg",
      mediaType: "image/jpg",
      summary: "This is the preview picture for the link.",
    },
    public: true,
  };

  await Promise.all(
    [note, post, media, link].map(async (o) => {
      await this.addPost(o);
    })
  );

  for (let i = 0; i < numUsers; i++) {
    let fn = faker.person.firstName();
    let ln = faker.person.lastName();
    let name = `${fn} ${ln}`;
    let username = `${fn.toLowerCase()}${ln}`;
    let email = `${username}@${faker.internet.domainName()}`;
    try {
      let user = await User.create({
        username,
        email,
        name,
        password: "12345",
      });

      let actor = await Actor.create({
        user: user._id,
        preferredUsername: username,
        name,
        bio: faker.person.bio(),
        url: [faker.internet.url()],
        location: {
          name: `${faker.location.city()}, ${faker.location.country()}`,
        },
      });

      user.actor = actor.id;
      await user.save();
    } catch (e) {
      console.log("Invalid username: ", username);
    }
  }

  const actors = await Actor.find({});

  for (let j = 0; j < numPosts; j++) {
    let type = ["Note", "Post", "Media", "Link"].random();
    let content = `<p>${faker.lorem.paragraphs(
      type == "Note" ? 1 : { max: 8, min: 2 },
      "</p>\n<p>"
    )}</p>`;
    let post = {
      actor: actors.random().id,
      type,
      source: {
        content,
      },
      public: true,
    };
    if (type != "Note") post.title = faker.lorem.words({ min: 2, max: 12 });
    if (type == "Media") {
      post.attachments = [];
      for (let k = 0; k < Math.floor(Math.random() * 4); k++) {
        post.attachments[k] = {
          href: faker.image.url,
          mediaType: "image/jpg",
          name: faker.lorem.words({ min: 2, max: 12 }),
        };
      }
    }

    if (type == "Link") post.href = faker.internet.url();
    await this.addPost(post);
  }

  let group = await this.addGroup({
    name: "The Capybara Club",
    creator: "@jzellis@kowloon.social",
    members: actors.map((a) => a.id),
    moderators: [actors[Math.floor(Math.random() * actors.length)].id],
    public: true,
  });

  return true;
  // function
}
