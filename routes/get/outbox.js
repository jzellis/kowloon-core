import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  response = await Kowloon.getPublicOutbox(
    req.user && req.user.actor ? req.user.actor.id : null,
    req.params.page || 1
  );
  res.status(status).json(response);
}
