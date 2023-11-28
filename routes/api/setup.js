import Kowloon from "../../kowloon.js";
import formidable from "formidable";
import fs from "fs/promises";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  if (!Kowloon.settings.setup || Kowloon.settings.setup === false) {
    try {
      await Kowloon.__reset();
      const form = formidable({ uploadDir: `./public/icons` });
      const [fields, files] = await form.parse(req);

      const siteIcon = files.siteIcon[0];
      const userIcon = files.userIcon[0];

      const server = [
        { name: "setup", value: true },
        {
          name: "icon",
          value: `./public/icons/server.${siteIcon.mimetype.split("/")[1]}`,
        },
        { name: "title", value: fields.title[0] },
        { name: "location", value: { name: fields.location[0] } },
        { name: "description", value: fields.description[0] },
        { name: "domain", value: fields.domain[0] },
        {
          name: "defaultPronouns",
          value: {
            they: {
              subject: "they",
              object: "them",
              possAdj: "their",
              possPro: "theirs",
              reflexive: "themselves",
            },
            she: {
              subject: "she",
              object: "her",
              possAdj: "her",
              possPro: "hers",
              reflexive: "herself",
            },
            he: {
              subject: "he",
              object: "him",
              possAdj: "his",
              possPro: "his",
              reflexive: "himself",
            },
          },
        },
        {
          name: "likeEmojis",
          value: [
            {
              name: "Like",
              emoji: "👍",
            },
            {
              name: "Love",
              emoji: "❤️",
            },
            {
              name: "Sad",
              emoji: "😭",
            },
            {
              name: "Angry",
              emoji: "🤬",
            },
            {
              name: "Shocked",
              emoji: "😮",
            },
            {
              name: "Puke",
              emoji: "🤮",
            },
          ],
        },
        // { name: "serverAdmins", value: [user._id] },
      ];
      server.map(async (setting) => {
        await Kowloon._createSetting(setting);
      });
      await Kowloon.init();
      const user = await Kowloon._createUser({
        username: fields.username[0],
        password: fields.password[0],
        email: fields.email[0],
        name: fields.name[0],
        bio: fields.bio[0],
        url: fields.url[0],
      });

      let update = {
        icon: `${fields.domain[0]}/avatars/${user._id}.${
          userIcon.mimetype.split("/")[1]
        }`,
      };
      await Kowloon._updateActor(user.actor.id, update);

      await Kowloon._createSetting({
        name: "serverAdmins",
        value: [user._id],
        public: false,
      });

      await fs.rename(
        siteIcon.filepath,
        `./public/icons/server.${siteIcon.mimetype.split("/")[1]}`
      );

      await fs.rename(
        userIcon.filepath,
        `./public/avatars/${user._id}.${userIcon.mimetype.split("/")[1]}`
      );
      response = { settings: Kowloon.settings, user };
    } catch (error) {
      console.error(error);
      response = { error };
    }
  } else {
    response = { error: "This site is already set up!" };
  }
  res.status(status).json(response);
}
