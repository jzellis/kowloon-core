import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  let actor = await Kowloon.getActorByUsername(req.params.id);
  if (
    Kowloon.user &&
    Kowloon.user.actor &&
    Kowloon.user.actor.id &&
    Kowloon.user.actor.id == actor.id
  ) {
    if (req.body.post)
      response.post = await Kowloon.createPost({
        ...req.body.post,
        actor: Kowloon.user.actor.id,
        attributedTo: Kowloon.user.actor.id,
      });
  }

  if (req.body.activity) {
    response.activity = await Kowloon.createActivity(req.body.activity);
  }

  res.status(status).json(response);
}
