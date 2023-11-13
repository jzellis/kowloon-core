import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  let status = 200;
  let response = {};
  let page = req.query.page || 1;

  if (req.user) Kowloon._setUser(req.user);
  let group = await Kowloon.getGroupById(req.params.id);
  res.status(status).json(response);
}
