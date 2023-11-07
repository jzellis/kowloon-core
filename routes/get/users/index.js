import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};

  let actor = await Kowloon.getActorByUsername(req.params.id);
  actor.privateKey = undefined;
  response = actor;
  res.status(status).json(response);
}
