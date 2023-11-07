import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};
  response = await Kowloon.getPublicTimeline(req.params.page || 1);
  res.status(status).json(response);
}
