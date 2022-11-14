import connectMongo from "../../utils/connectMongo";
import { Settings } from "../../models";
import { user, users, addUser, updateUser } from "./users";
import { post, posts, addPost, updatePost } from "./posts";
import { circle, circles, addCircle, updateCircle } from "./circles";
import { comment, comments, addComment, updateComment } from "./circles";
import { login } from "./login";

/**
 * Kowloon class, with static methods
 */
class Kowloon {
  constructor() {}

  /**
   * Returns the server settings as a key-value object
   * @returns {object}
   */
  static settings = async () =>
    JSON.parse(JSON.stringify(await Settings.findOne({}, { _id: 0 })));

  static user = async (search, fields, options) =>
    user(search, fields, options);

  static users = async (search, fields, options) =>
    users(search, fields, options);

  static addUser = async (user) => addUser(user);

  static updateUser = async (id, fields) => updateUser(id, fields);

  /** Static method, returns a single user based on critera passed (i.e. {username: bob"}) */
  static post = async (search, fields, options) =>
    post(search, fields, options);

  /** Static method, returns an array of users based on critera passed (i.e. {username: bob"}) with limit and offset */
  static posts = async (search, fields, options) =>
    posts(search, fields, options);

  static addPost = async (post) => addPost(post);

  /** Static method, returns a single user based on critera passed (i.e. {username: bob"}) */
  static circle = async (search, fields, options) =>
    circle(search, fields, options);

  /** Static method, returns an array of users based on critera passed (i.e. {username: bob"}) with limit and offset */
  static circles = async (search, fields, options) =>
    circles(search, fields, options);

  static comment = async (search, fields, options) =>
    comment(search, fields, options);

  /** Static method, returns an array of users based on critera passed (i.e. {username: bob"}) with limit and offset */
  static comments = async (search, fields, options) =>
    comments(search, fields, options);

  static login = async (usernameOrEmail, password) =>
    login(usernameOrEmail, password);
}

module.exports = Kowloon;
