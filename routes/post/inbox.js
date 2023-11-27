// Doesn't do anything yet
import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};

  if (req.user && req.body.activity) {
    response = await Kowloon.createActivity(req.body.activity);
  } else {
    status = 401;
    response.error = "Unauthorized";
  }

  res.status(status).json(response);
}
