import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  let user = req.body;
  if (user.actor && typeof user.actor == "object")
    user.actor = await Kowloon.createActor(user.actor);
  response = await Kowloon.createUser(user);
  res.status(status).json(response);
}
