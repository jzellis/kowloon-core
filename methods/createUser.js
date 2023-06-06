import CollectionSchema from "../schema/collection.js";
import { Activity, User } from "../schema/index.js";

export default async function handler(
  user = { username, password, name, email, summary, location, urls }
) {
  let newUser = await User.create({
    username: user.username,
    actorId: `${this.settings.domain}/@${user.username}`,
    password: user.password,
    email: user.email,
    actor: {
      id: `${this.settings.domain}/@${user.username}`,
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
        url: `${this.settings.domain}/public/images/avatars/${user.username}.png`,
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
    },

    prefs: {
      defaultPostType: "Note",
      defaultIsPublic: true,
      publicFollowers: true,
      publicFollowing: true,
    },
    isAdmin: true,
  });

  let activity = await Activity.create({
    owner: newUser._id,
    type: "Create",
    actor: newUser.actor.id,
    result: newUser.actor,
    _kowloon: {
      isPublic: true,
    },
  });
  return this.sanitize(activity);
}
