import { User, Log } from "../../models";
import connectMongo from "../../utils/connectMongo";
import bcrypt from "bcryptjs";

/**
 * Login a user with username or email and password. Returns the user's login token.
 * @param {string} usernameOrEmail - Username or email
 * @param {*} password - Password
 * @returns {object}
 */
const login = async (usernameOrEmail = "", password = "") => {
  const request = usernameOrEmail.includes("@")
    ? { error: "Email not found", query: { email: usernameOrEmail } }
    : { error: "Username not found", query: { username: usernameOrEmail } };

  let response = {};
  let user = await User.findOne(request.query);
  password = password ? await bcrypt.compare(password, user.password) : false;
  switch (true) {
    case !user:
      response.error = request.error;
      break;

    case password == false:
      response.error = "Invalid password";
      break;

    case user && password == true:
      response.user = user._id;
      response.token = user.loginToken;
      break;
  }
  await Log.create({ user: user._id, logType: "login" });
  return response;
};

export { login };
