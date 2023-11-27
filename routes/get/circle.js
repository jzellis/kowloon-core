import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};
  let query = req.params.id;
  let circle = await Kowloon.getCircle(query);
  if (!circle) response.error = "Circle not found";
  if (
    circle &&
    circle.public == false &&
    circle.creator.id != Kowloon.user.actor.id
  ) {
    response.error = "You are not authorized to view this circle";
  } else {
    response.circle = circle;
  }

  res.status(status).json(response);
}
