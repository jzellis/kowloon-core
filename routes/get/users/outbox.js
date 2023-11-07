import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  console.log(Kowloon.actor.id);
  let status = 200;
  let response = {};
  response = await Kowloon.getActorPosts(req.params.id);

  res.status(status).json(response);
}
