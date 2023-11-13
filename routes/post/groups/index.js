import Kowloon from "../../../kowloon.js";
export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  if (Kowloon.user && Kowloon.user.actor && Kowloon.user.actor.id) {
    let group = { creator: Kowloon.user.actor.id, ...req.body };
    response = await Kowloon.createGroup(req.body);
  } else {
    response = { error: "You must be authenticated to create a group." };
  }
  res.status(status).json(response);
}
