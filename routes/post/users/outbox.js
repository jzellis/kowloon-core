import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  try {
    let actor = await Kowloon.getActor(req.params.id);
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
        });
    }
  } catch (error) {
    response = { error };
  }
  res.status(status).json(response);
}
