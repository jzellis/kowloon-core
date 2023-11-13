import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  if (req.user) Kowloon._setUser(req.user);
  let actor = await Kowloon.getActor(req.params.id);
  response = await Kowloon.getActorOutbox(actor.id);

  res.status(status).json(response);
}
