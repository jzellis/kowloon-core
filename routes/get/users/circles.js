import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  let actor = await Kowloon._getActor(req.params.id);
  response = actor;
  let query = { _id: { $in: actor.circles } };
  console.log(query);
  if (!Kowloon.user || Kowloon.user?.actor?.id != actor.id) query.public = true;
  let circles = await Kowloon._getCircles(query);
  response = { circles };
  res.status(status).json(response);
}
