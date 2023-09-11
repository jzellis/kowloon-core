import Kowloon from "../../kowloon.js";
export default async function handler(req, res, next) {
  let status = 200;
  let { username, password } = req.body;
  res.status(200).send(await Kowloon.login(username, password));
}
