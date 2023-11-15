import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};

  let actor = await Kowloon.getActor(req.params.id);
  response = actor;
  res.status(status).json(response);
}
