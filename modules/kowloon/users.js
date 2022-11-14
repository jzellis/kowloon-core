import { User, Circle } from "../../models";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Returns a User object
 * @param {Object} search - The criteria for the user
 * @param {*} fields - Which fields to return
 * @returns {object}
 */
const user = async function (search, fields) {
  search = search || {};
  fields = fields || {};
  search.active = true;
  fields.password = 0;
  fields.active = 0;
  fields.loginToken = 0;
  const response = {};
  response.user = await User.findOne(search, fields);
  return JSON.parse(JSON.stringify(response));
};

/**
 * Returns an array of User objects
 * @param {object*} search
 * @param {object} fields
 * @param {number} limit
 * @param {number} offset
 * @returns {Array}
 */
const users = async function (search, fields, options) {
  search = search || {};
  fields = fields || {};
  options = options || {};
  search.active = true;
  fields.password = 0;
  fields.active = 0;
  fields.loginToken = 0;
  options.limit = 0;
  options.offset = 0;
  const response = {};
  response.users = await User.find(search, fields);
  return JSON.parse(JSON.stringify(response));
};

/**
 * Creates a new user, encrypts their password and creates a login token as well.
 * @param {*} user - The user object to be added
 * @returns {object,object}
 */
const addUser = async (newuser) => {
  let response = {};

  let rawpassword = newuser.password;
  newuser.password = await bcrypt.hash(rawpassword, 10);
  try {
    const user = await User.create(newuser);

    let token = jwt.sign(
      { user_id: user._id, email: user.email, password: rawpassword },
      process.env.TOKEN_KEY
    );

    user.loginToken = token;
    await user.save();
    let circle = await Circle.create({
      name: "Friends",
      user: user._id,
    });
    response = {
      user,
      circle,
    };
  } catch (e) {
    console.log(e);
    response.error = e;
  }
  return JSON.parse(JSON.stringify(response));
};

/**
 * Update a user by ID
 * @param {*} userId - The ID of the user to be updated
 * @param {*} fields - The fields to be updated
 * @returns {object}
 */
const updateUser = async (userId, fields) => {
  let response = { userId, fields };
  try {
    await User.findByIdAndUpdate(userId, fields);
    response.user = await User.findById(userId);
  } catch (e) {
    console.log(e);
    response.error = e;
  }
  return JSON.parse(JSON.stringify(response));
};

export { user, users, addUser, updateUser };
