import Kowloon from "../../../kowloon.js";
export default async function handler(req, res, next) {
  if (req.user) Kowloon._setUser(req.user);
  let status = 200;
  let response = {};

  let query = { _id: req.params.id };
  query =
    Kowloon.user && Kowloon.user.actor && Kowloon.user.actor.id
      ? { ...query, members: Kowloon.user.actor.id }
      : { ...query, public: true, hidden: false };
  let group = await Kowloon.queryGroups(query);
  response = {
    "@context": "https://www.w3.org/ns/activitystreams",
    ...group._doc,
  };

  res.status(status).json(response);
}
