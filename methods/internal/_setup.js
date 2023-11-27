import Kowloon from "../../kowloon.js";
import { Settings, Activity } from "../../schema/index.js";
import crypto from "crypto";

export default async function (
  args = {
    adminUser: {
      username: "admin",
      password: "admin",
      name: "Admin",
      email: "admin@kowloon.social",
      bio: "I am the admin of this server.",
      url: ["https://kowloon.social"],
      isAdmin: true,
    },
    settings: {
      title: "Kowloon.social",
      description: "The very first Kowloon server ever!",
      location: {
        name: "Kowloon, Hong Kong",
        type: "Place",
        latitude: 22.332222,
        longitude: 114.190278,
      },
      domain: "kowloon.social",
      asDomain: "kowloon.social",
      uploadDir: "./uploads",
      registrationIsOpen: false,
      defaultPronouns: {
        subject: "they",
        object: "them",
        possAdj: "their",
        possPro: "theirs",
        reflexive: "themselves",
      },
      blockedDomains: [],
      likeEmojis: [
        { name: "Like", emoji: "👍" },
        { name: "Love", emoji: "❤️" },
        { name: "Sad", emoji: "😭" },
        { name: "Angry", emoji: "🤬" },
        { name: "Shocked", emoji: "😮" },
        { name: "Puke", emoji: "🤮" },
      ],
      adminEmail: "admin@kowloon.social",
      icon: "https://kowloon.social/icons/server.png",
    },
  }
) {
  await Settings.deleteMany();
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // Adjust the key length as per your requirements
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  let defaults = [
    {
      name: "setup",
      description: "Has the site been set up?",
      value: false,
      editable: false,
      ui: { type: "checkbox" },
    },
    {
      name: "title",
      description: "The title of your site",
      value: args.settings.title,
      editable: true,
      ui: { type: "text" },
    },
    {
      name: "description",
      description: "A description of your server",
      value: args.settings.description,
      editable: true,
      ui: { type: "text" },
    },
    {
      name: "location",
      description: "Your server's location",
      value: args.settings.location,
      editable: true,
      ui: {
        type: "text",
      },
    },
    {
      name: "domain",
      description: "Your site's domain",
      value: args.settings.domain,
      editable: true,
      ui: { type: "text" },
    },
    {
      name: "asDomain",
      description: "The ActivityPub domain of your site",
      value: args.settings.asDomain,
      editable: true,
      ui: { type: "text" },
    },
    {
      name: "uploadDir",
      description: "The directory for uploads",
      value: args.settings.uploadDir,
      editable: true,
      public: false,
      ui: { type: "text" },
    },
    {
      name: "registrationIsOpen",
      description: "Can anyone create an account on your site?",
      value: args.settings.registrationIsOpen,
      editable: true,
      ui: { type: "checkbox" },
    },
    {
      name: "defaultPronouns",
      description: "The default pronouns for users",
      value: args.settings.defaultPronouns,
      editable: true,
      ui: { type: "select" },
    },
    {
      name: "blockedDomains",
      description: "Blocked domains",
      value: args.settings.blockedDomains,
      editable: true,
      public: false,
      ui: { type: "text" },
    },
    {
      name: "publicKey",
      description: "The server's public key",
      value: publicKey,
      editable: false,
      ui: {},
    },
    {
      name: "privateKey",
      description: "The server's private key",
      value: privateKey,
      public: false,
      editable: false,
      ui: {},
    },
    {
      name: "likeEmojis",
      description: "The emojis you can use on this server",
      value: args.settings.likeEmojis,
      editable: true,
      public: true,
      ui: {},
    },
    {
      name: "icon",
      description: "The server's icon",
      value: args.settings.icon,
      editable: true,
      public: true,
      ui: {
        type: "file",
      },
    },
  ];
  await Promise.all(defaults.map(async (s) => await Settings.create(s)));
  let serverUserPassword = this._generatePassword();
  let serverUser = await this._createUser({
    type: "Server",
    username: args.settings.asDomain,
    password: serverUserPassword,
    name: args.settings.title,
    email: args.settings.adminEmail,
    bio: args.settings.description,
    isAdmin: true,
    url: [`https://${args.settings.domain}`],
    href: `https://${args.settings.asDomain}`,
    publicKey,
    privateKey,
  });

  serverUser.password = serverUserPassword;

  await Settings.create({
    name: "serverUser",
    value: serverUser._id,
    editable: false,
    public: false,
    ui: {},
  });

  let activity = await Kowloon.createActivity({
    type: "Create",
    actor: serverUser.actor.id,
    objectType: "Post",
    object: {
      actor: serverUser.actor.id,
      type: "Note",
      source: {
        content: "Welcome to Kowloon!",
        mediaType: "text/html",
      },
      public: true,
      publicCanReply: false,
      wordCount: 3,
      characterCount: 19,
    },
  });

  activity = await Activity.findOne({ _id: activity.activity._id });
  let adminUser = await this._createUser(args.adminUser);

  await Settings.create({
    name: "serverAdmins",
    description: "Server admin users",
    editable: false,
    public: false,
    ui: {},
    value: [adminUser._id],
  });
  adminUser.password = args.adminUser.password;
  let settings = await Settings.find();

  return { serverUser, adminUser, settings };
}
