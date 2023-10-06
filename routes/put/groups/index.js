import Kowloon from "../../../kowloon.js";
export default async function handler(req, res, next) {
  if (req.user) Kowloon.setUser(req.user);
  let status = 200;
  let response = {};

  let group = await Kowloon.queryGroups({
    _id: req.params.id,
    admins: req.user.actor.id,
  });

  if (group) response = await Kowloon.updateGroup(group.id, req.body);

  res.status(status).json(response);
}
