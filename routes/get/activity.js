import Kowloon from "../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};

  let activity = await Kowloon.getActivity(req.params.id);
  response = activity;

  res.status(status).json(response);
}
