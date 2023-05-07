import * as dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generateKeyPairSync } from "crypto";
import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";
import { convert, htmlToText } from "html-to-text";
import Parser from "rss-parser";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import {
  Circle,
  Comment,
  Email,
  Feed,
  Following,
  Friend,
  Media,
  Post,
  Settings,
  User,
} from "./schema/index.js";

import { rootCertificates } from "tls";
dotenv.config();
const Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  SALT_WORK_FACTOR = 10;
const KEY = process.env.JWT_KEY;
const parser = new Parser();

/**
 * @module Kowloon
 */
class kowloon {
  //the class constructor
  /**
   * constructor description
   * @param  {null} null Has no parameters
   */
  constructor() {
    this.settings = {};
    this.user = null;
    this.key = null;
    this.connection = {};
  }

  /** init Initializes and retrieves settings */
  init = async () => {
    console.log("Loading Kowloon....");
    // if (!mongoose.connections[0].readyState) {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.connection.isConnected = db.connections[0].readyState;

    console.log("DB connection established");
    // }

    const settings = await Settings.find({});
    settings.forEach((setting) => {
      this.settings[setting.name] = setting.value;
    });
  };
  /**
   * Logs in a user and returns the user record. This does not mask out passwords or keys, so be careful!
   * @param {String} username the username
   * @param {String} password the password
   * @return {Object} The user object
   */

  setUser = (user) => {
    this.user = user;
  };

  login = async (u, p) => {
    try {
      let user = await User.findOne({ username: u });
      if (!user) return { error: "username not found" };
      if ((await bcrypt.compare(p, user.password)) == true) {
        await User.updateOne(
          { _id: user._id },
          { $set: { lastLogin: Date.now() } }
        );
        this.setUser(user);
        return jwt.sign(
          { username: user.username, email: user.email.address, id: user._id },
          process.env.JWT_KEY,
          { expiresIn: 31556926 }
        );
        // return token;
      } else {
        return { error: "incorrect password" };
      }
    } catch (e) {
      console.log(e);
    }
  };

  logout = () => {
    this.setUser(null);
  };

  /** Authenticates a user against their API key. */
  auth = async (token) => {
    try {
      let payload = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findOne(
        { _id: new ObjectId(payload.id) },
        { password: 0, publicKey: 0, privateKey: 0 }
      );
      this.user = user;
      return user;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  /** Returns a user */
  getUser = async (query, fields) => {
    fields = fields || "_id username profile prefs icon email";
    if (query._id && query._id.match(/^[0-9a-fA-F]{24}$/) != null) {
      query._id = new ObjectId(query._id);
    } else {
      delete query._id;
    }
    query = { ...query, active: true };
    return await User.findOne(query, fields);
  };

  getUsers = async (query) => {
    query = { ...query, active: true };
    return await User.find(query);
  };

  /** Creates a user (username, password and email required) */
  createUser = async (user) => {
    try {
      user = await User.create(user);
      let circle = await Circle.create({ user: user._id, name: "Friends" });
      return { user, circle };
    } catch (e) {
      console.log(e);
      return new Error(e);
    }
  };

  /** Updates a user. Any params sent are updated. */
  updateUser = async (newUser) => {
    try {
      let user = await User.findOne(
        { _id: new ObjectId(newUser._id) },
        "_id username password profile prefs icon email"
      );
      Object.entries(newUser).forEach((entry) => {
        const [key, value] = entry;
        user[key] = value;
      });
      // console.log(user);
      user.save();
      return user;
    } catch (e) {
      return new Error(e);
    }
  };

  /** Deletes a user */
  deleteUser = async (id) => {
    return await User.updateOne({ _id: id }, { active: false });
  };

  /** Returns a user as an ActivityPub "Actor" object */
  getUserAsACActor = async (user) => {
    user = await User.findOne(user);
    return {
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        "https://w3id.org/security/v1",
      ],
      id: `https://${this.settings.domain}/${user.username}`,
      type: "Person",
      preferredUsername: user.username,
      inbox: `https://${this.settings.domain}/${user.username}/inbox`,
      publicKey: {
        id: `https://${this.settings.domain}/${user.username}#main-key`,
        "@type": "Key",
        owner: `https://${this.settings.domain}/${user.username}`,
        publicKeyPem: `${user.publicKey}`,
      },
    };
  };

  /** Returns a user for the ActivityPub webfinger endpoint. */
  getUserWebfinger = async (user) => {
    user = await User.findOne(user);
    return {
      subject: `acct:${user.username}@${this.settings.domain}`,
      aliases: [`https://${this.settings.domain}/@${user.username}`],
      links: [
        {
          rel: "self",
          type: "application/activity+json",
          href: `https://${this.settings.domain}/${user.username}`,
        },
        user.profile.links.map((link) => {
          return {
            rel: "me",
            href: link,
          };
        }),
      ],
    };
  };

  getPost = async (query) => {
    query = { ...query, author: this.user._id, deleted: false };
    return await Post.findOne(query);
  };

  getPosts = async (query) => {
    const page = query.limit || 1;
    const q = {
      deleted: false,
      public: query.public || true,
    };
    if (query.username) {
      let user = await User.findOne({ username: query.username });
      q.author = user._id;
    }
    if (query.type && query.type != "all") q.type = query.type;
    if (query.maxId || query.minId || query.sinceId) {
      q._id = {};
      if (query.maxId) q._id["$lt"] = new ObjectId(query.maxId);
      if (query.minId) q._id["$gt"] = new ObjectId(query.minId);
      if (query.sinceId) q._id["$gt"] = new ObjectId(query.sinceId);
    }
    console.log(q);
    const posts = await Post.find(q)
      .sort({ publishedAt: -1 })
      .limit(20)
      .skip((page - 1) * 20)
      .populate("author")
      .populate("circles", "name icon");
    return await Promise.all(
      posts.map(async (post) => {
        return this.convertPostToJsonFeedItem(post);
      })
    );
  };

  getDeletedPosts = async (query) => {
    query = { ...query, deleted: true, published: true };
    return await Post.find(query);
  };

  createPost = async (post) => {
    post.author = this.user._id;
    post.title = post.title ? post.title : null;
    try {
      let newPost = await Post.create(post);
      newPost.author = await User.findOne({ _id: post.author });
      let convertedPost = await this.convertPostToJsonFeedItem(newPost);
      let feedPost = await Feed.create(convertedPost);
      return feedPost;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  updatePost = async (post) => {
    try {
      return await Post.updateOne({ _id: post._id }, post);
    } catch (e) {
      return new Error(e);
    }
  };

  deletePost = async (post) => {
    try {
      return await Post.updateOne(
        { _id: post._id },
        { $set: { deleted: true } }
      );
    } catch (e) {
      return new Error(e);
    }
  };

  convertPostToJsonFeedItem = async (post) => {
    if (!post.author) {
      post.author = await User.findOne({
        _id: new ObjectId(post.author),
      });
    }
    let convertedPost = {
      id: `https://${this.settings.domain}/posts/${post._id}`,
      url: `https://${this.settings.domain}/posts/${post._id}`,
      title: post.title || null,
      external_url: post.link || null, // This is an external link, like for Kowloon "link" posts
      kowloon: {
        type: post.type,
        source: {
          type: "User",
          name: post.author.profile.name && post.author.profile.name,
          url: `https://${this.settings.domain}/users/${post.author.username}`, // the URL of the source, not the feed URL
          icon: `https://${this.settings.domain}/avatars/${post.author.icon}`,
        },
        attachments: post.attachments,
      },
      activity_pub: {
        "@context": [
          "https://www.w3.org/ns/activitystreams",
          { "@language": post.language },
        ],
        type: post.type,
        id: `https://${this.settings.domain}/posts/${post._id}`,
        source: {
          content: post.content.html,
          mediaType: "text/html",
        },
      },
      date_published: post.publishedAt,
      content_html: post.content.html,
      content_text: post.content.text,
      summary: post.content.summary,
      image: post.image,
      author: {
        name: post.author.profile.name,
        url: `https://${this.settings.domain}/users/${post.author.username}`,
      },
      tags: post.tags,
      language: post.language,
    };
    return convertedPost;
  };

  convertRssItemToFeed = (item, feed) => {
    return {
      id: item.guid || item.id || item.link,
      url: item.link, // This is an external link, like for Kowloon "link" posts
      title: item.title,
      kowloon: {
        source: {
          type: "following",
          name: feed.name,
          url: feed.url,
          icon: feed.icon,
        },
      },
      date_published: item.pubDate || item.isoDate,
      content_html: item.content,
      summary: item.contentSnippet,
      tags: typeof item.categories == "array" ? item.categories : null,
    };
  };

  getLinkPreview = async (url) => {
    try {
      return await getLinkPreview(url, {
        timeout: 5000,
        followRedirects: true,
      });
    } catch (e) {
      return { error: e };
    }
  };

  getLinkPreviewImage = async (url) => {
    try {
      let p = await getLinkPreview(url, {
        timeout: 5000,
        followRedirects: true,
      });
      return { url: p.images[0] };
    } catch (e) {
      return { error: e };
    }
  };

  getComment = async (query) => {
    return await Comment.findOne(query);
  };

  getComments = async (query) => {
    return await Comments.find(query);
  };

  createComment = async (comment) => {
    return await Comment.create(comment);
  };

  updateComment = async (comment) => {
    return await Comment.updateOne({ _id: comment._id }, comment);
  };

  getMedia = async (media) => await Media.findOne(media);

  deleteComment = async (comment) => {
    return await Comment.updateOne(
      { _id: comment._id },
      { $set: { deleted: true } }
    );
  };

  getCircle = async (query) => {
    return await Circle.findOne(query);
  };

  getCircles = async (query) => {
    query = { ...query, user: this.user._id };
    return await Circle.find(query);
  };

  createCircle = async (circle) => {
    return await Circle.create(circle);
  };

  updateCircle = async (circle) => {
    return await Circle.updateOne({ _id: circle._id }, circle);
  };

  deleteCircle = async (circle) => {
    return await Circle.updateOne(
      { _id: circle._id },
      { $set: { deleted: true } }
    );
  };

  createMedia = async (media) => await Media.create(media);

  createFollowingFromUrl = async (url) => {
    try {
      let feed = await parser.parseURL(url);
      feed.items = [];
      let nfol = {
        user: this.user,
        feedType: "rss",
        uniqueId: feed.link,
        name: feed.title,
        url: feed.link,
        feedUrl: url,
        icon: feed.image ? feed.image.url : "",
        description: feed.description,
      };
      // return feed;
      return await Following.create(nfol);
    } catch (e) {
      console.log(e);
    }
  };

  getPublicPosts = async (query = {}) => {
    let posts = await Post.find({
      ...query,
      public: true,
      deleted: false,
      publishedAt: { $lte: Date.now() },
    })
      .populate({ path: "attachments" })
      .populate("author", "username profile icon");
    return posts.map(async (post) => this.convertPostToJsonFeedItem(post));
  };

  addSetting = async (setting) => await Settings.create(setting);

  getUserPosts = async (userId, options = { public: false }) => {
    return await Post.find({
      author: userId,
      public: options.public,
      deleted: false,
    }).populate({ path: "attachments" });
  };

  getUserTimeline = async (options = { page: 1, read: true, type: null }) => {
    let { page, read, type } = options;
    let q = {
      "kowloon.read": read ? read : false,
    };
    if (type != null) q["kowloon.post_type"] = type;
    const numItems = 10;
    page = page - 1;

    return await Feed.find(q)
      .limit(numItems)
      .skip(numItems * page)
      .sort({ date_published: "desc" });
  };

  refreshUserTimeline = async () => {
    const following = await Following.find({
      user: this.user,
      feedType: "rss",
    });
    const posts = await Post.find().populate("author attachments");
    await Feed.deleteMany({});
    // await Promise.all(
    //   await following.map(async (feed) => {
    //     try {
    //       let parsed = await parser.parseURL(feed.feedUrl);
    //       await parsed.items.map(async (item) => {
    //         // await Feed.create(this.convertRssItemToFeed(item, feed));
    //         let cnvitem = await this.convertRssItemToFeed(item, feed);
    //         await Feed.findOneAndUpdate({ id: this.id }, cnvitem, {
    //           upsert: true,
    //         });
    //       });
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   })
    // );
    await Promise.all(
      await posts.map(async (post) => {
        const fi = await this.convertPostToJsonFeedItem(post);
        await Feed.create(fi);
      })
    );
    await User.updateOne(this.user, {
      $set: { lastTimelineUpdate: Date.now() },
    });
    return true;
  };

  dbStatus = () => {
    return mongoose.connections[0].readyState;
  };

  transferFollowing = async () => {
    let user = await User.findOne();
    await Post.updateMany({}, { $set: { author: user._id } });
    return true;
  };
}
/** kowloon class definition
 */

const Kowloon = new kowloon();
await Kowloon.init();
export default Kowloon;
