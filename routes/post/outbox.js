import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (!req.user) {
    res.status(500).response({ error: "You are not authorized to do this" });
    return false;
  }
  let status = 200;
  let response = {};
  response = await Kowloon.addPost({ ...req.body, actor: req.user.actor });
  res.status(status).json(response);
}
