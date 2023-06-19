import CollectionSchema from "../schema/collection.js";
import { Activity, User } from "../schema/index.js";

export default async function handler(
  user = {
    username,
    password,
    name,
    email,
    summary,
    location,
    icon,
    urls,
    isAdmin,
    pronouns,
  }
) {
  try {
    let newUser = await User.create({
      username: user.username,
      id: `@${user.username}@${this.settings.domain.split("//")[1]}`,
      password: user.password,
      email: user.email,
      actor: {
        id: `@${user.username}${this.settings.apDomain}`,
        type: "Person",
        name: user.name,
        preferredUsername: user.username,
        summary: user.summary,
        location: {
          type: "Place",
          name: user.location,
        },
        icon: {
          type: "Image",
          name: user.name,
          url: user.icon || `${this.settings.domain}/images/avatars/avatar.png`,
        },
        url: user.urls.map((u) => {
          return { href: u };
        }),
        circles: [
          {
            "@context": "https://www.w3.org/ns/activitystreams",
            name: `Friends`,
            summary: `Friends`,
            type: "Circle",
            items: [],
          },
        ],
        pronouns: pronouns || this.settings.defaultPronouns,
      },

      prefs: {
        defaultPostType: "Note",
        defaultIsPublic: true,
        publicFollowers: true,
        publicFollowing: true,
      },
      isAdmin: user.isAdmin || false,
    });
    return newUser;
  } catch (e) {
    console.log(e);
  }
}
