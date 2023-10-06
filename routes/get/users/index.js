import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};

  let actor = await Kowloon.getActorByUsername(req.params.id);
  response = {
    "@context": "https://www.w3.org/ns/activitystreams",

    ...actor._doc,
  };
  res.status(status).json(response);
}
