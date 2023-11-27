import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  if (req.user) Kowloon._setUser(req.user);
  let actor = await Kowloon.getActor(req.params.id);
  if (!actor) {
    response.error = "User not found";
  } else {
    if (actor && Kowloon.user?.actor?.id != actor.id) {
      response = { error: "You are not authorized to view this page" };
    } else {
      let page = req.query.page || 1;
      let items = await Kowloon.getActorInbox(actor.id, page);
      response = items;
    }
  }
  res.status(status).json(response);
}
