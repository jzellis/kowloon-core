import Kowloon from "../../../kowloon.js";

export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let group = await Kowloon.getGroup(req.params.id);
  let status = 200;
  let response = {};
  let page = req.query.page || 1;
  response = await Kowloon.getGroupInbox(group.id, page);
  res.status(status).json(response);
}
