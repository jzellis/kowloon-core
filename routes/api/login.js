import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  let { username, password } = req.body;
  let user = await Kowloon.login(username, password);
  let status = 200;
  let response = user;

  res.status(status).json(response);
}
