import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};

  let actor = await Kowloon.getActorByUsername(req.params.id);
  if (
    Kowloon.user &&
    Kowloon.user.actor &&
    Kowloon.user.actor.id &&
    Kowloon.user.actor.id == actor.id
  ) {
    response = await Kowloon.createActivity({
      actor: Kowloon.user.actor.id,
      ...req.body,
    });
  }
  res.status(status).json(response);
}
