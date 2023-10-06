import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};

  let actor = await Kowloon.getActorByUsername(
    Kowloon.user.actor.preferredUsername
  );
  let updatedUser = { _id: Kowloon.user._id, ...req.body };
  let updatedActor = { id: Kowloon.user.actor.id, ...req.body.actor };
  await Kowloon.updateActor(updatedActor);
  response = await Kowloon.updateUser(updatedUser);
  res.status(status).json(response);
}
